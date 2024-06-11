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
import { Observable, finalize, from, switchMap, tap } from 'rxjs';
import { Book } from './model/book.model';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private dbPath = '/books';
  booksRef: CollectionReference<Book>;

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

    console.log('book', Object.assign({}, book));
    delete book.id;
    // return addDoc(this.booksRef, Object.assign({}, book));
    return from(addDoc(this.booksRef, Object.assign({}, book))).pipe(
      tap(() => console.log('Document added')),
      switchMap(() => this.getAllBooksByUser(book.userId)) // This must return Observable<Book[]>
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
    return docData(bookDocRef, { idField: 'id' }) as Observable<Book>;
  }

  getAllBooksByUser(userId: string): Observable<Book[]> {
    const booksQuery = query(this.booksRef, where('userId', '==', userId));
    return collectionData(booksQuery, { idField: 'id' }) as Observable<Book[]>;
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
