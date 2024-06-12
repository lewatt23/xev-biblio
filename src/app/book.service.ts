import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { Book } from './model/book.model';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { Auth, User, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private dbPath = '/books';
  booksRef: CollectionReference<Book>;
  auth = inject(Auth);
  state = authState(this.auth);

  constructor(private firestore: Firestore, private storage: Storage) {
    this.booksRef = collection(
      this.firestore,
      this.dbPath
    ) as CollectionReference<Book>;
  }

  async createBook(book: Book): Promise<Observable<Book[]>> {
    if (!book.validate()) {
      throw new Error('Validation failed');
    }

    delete book.id;
    // return addDoc(this.booksRef, Object.assign({}, book));
    return from(addDoc(this.booksRef, Object.assign({}, book))).pipe(
      tap(() => console.log('Document added')),
      switchMap(() => this.getAllBooksByUser()) // This must return Observable<Book[]>
    );
  }

  async updateBook(id: string, book: Book): Promise<void> {
    const bookDocRef = doc(this.firestore, this.dbPath, id);
    return updateDoc(bookDocRef, book.toFirestore());
  }

  async deleteBook(id: string): Promise<void> {
    const bookDocRef = doc(this.firestore, this.dbPath, id);
    return deleteDoc(bookDocRef);
  }

  getBook(id: string): Observable<Book> {
    const bookDocRef = doc(this.firestore, this.dbPath, id);
    return docData(bookDocRef, { idField: 'id' }).pipe(
      map(
        (book: any) =>
          ({
            ...book,
            date: new Date(book.date.seconds * 1000),
          } as Book)
      )
    );
  }

  getAllBooksByUser(): Observable<Book[]> {
    return this.state.pipe(
      switchMap((user: User) => {
        if (!user) {
          return of([]);
        }
        const booksQuery = query(
          this.booksRef,
          where('userId', '==', user.uid)
        );
        return collectionData(booksQuery, { idField: 'id' }).pipe(
          map(
            (books: any) =>
              books.map((book: any) => ({
                ...book,
                date: book.date ? new Date(book.date.seconds * 1000) : null,
              })) as Book[]
          )
        );
      })
    );
  }

  uploadImage(file: File) {
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);

    // Return an Observable that emits the download URL after the upload completes
    return from(
      uploadBytesResumable(fileRef, file).then(() => getDownloadURL(fileRef))
    );
  }
}
