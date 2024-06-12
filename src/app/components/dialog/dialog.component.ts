import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BookService } from '../../core/services/book/book.service';
import { Book } from '../../core/model/book.model';
import { AuthService } from '../../core/services/auth/auth.service';

export interface Tag {
  name: string;
}

export interface DialogId {
  id: string;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  private bookservice: BookService = inject(BookService);
  private authservice: AuthService = inject(AuthService);

  errorMessage: string | undefined = undefined;
  loading: boolean = false;
  bookForm: FormGroup;
  file: File | undefined;
  imageUrl: string | null = null;
  editBook: Book = new Book({});

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogId
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      author: ['', [Validators.required]],
      tags: [''],
      imageUrl: [''],
    });

    if (data?.id) {
      this.bookservice.getBook(data.id).subscribe({
        next: (book: Book) => {
          const editTags: any[] = book.tags.map((item) => ({
            name: item,
          }));
          this.tags = editTags;

          this.editBook = book;
          this.bookForm.setValue({
            tags: book.tags,
            title: book.title,
            date: book.date,
            author: book.author,
            imageUrl: book.imageUrl,
          });
        },
        error: (error) => {
          console.error('Error fetching books:', error);
        },
      });
    }
  }

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push({ name: value });
    }

    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: Tag, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(tag);
      return;
    }

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      this.file = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.bookForm.valid) {
      console.log('Error in form submission', this.bookForm.errors);
      return;
    }

    this.loading = true;

    const handleSuccess = () => {
      this.dialogRef.close();
      this.loading = false;
    };

    const handleError = (error: any) => {
      this.errorMessage = error;
      this.loading = false;
      console.error('Operation failed:', error);
    };

    const updateBookDetails = (imageUrl?: string) => {
      const formValue = {
        ...this.bookForm.value,
        imageUrl: imageUrl || this.bookForm.value.imageUrl,
      };

      const book = new Book({
        ...formValue,
        userId: this.authservice.user?.uid || '',
        id: this.editBook?.id || null,
        tags: this.tags.map((t) => t.name),
      });

      const operation = book.id
        ? this.bookservice.updateBook(book.id, book)
        : this.bookservice.createBook(book);

      operation.then(handleSuccess).catch(handleError);
    };

    if (this.file) {
      this.bookservice.uploadImage(this.file).subscribe({
        next: (url) => updateBookDetails(String(url)),
        error: (err) => {
          console.error('Upload error:', err);
          handleError('Failed to upload file.');
        },
      });
    } else {
      updateBookDetails();
    }
  }
}
