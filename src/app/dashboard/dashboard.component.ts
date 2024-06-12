import { AuthService } from './../auth.service';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BookService } from '../book.service';
import { Book } from '../model/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private bookservice: BookService = inject(BookService);
  private authService: AuthService = inject(AuthService);

  constructor(public dialog: MatDialog) {}
  books: Book[] = [];
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  delete(id: string | undefined) {
    this.bookservice.deleteBook(String(id));
  }

  edit(id: string | undefined) {
    this.dialog.open(DialogComponent, {
      data: { id: id },
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.bookservice.getAllBooksByUser().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error fetching books:', error);
      },
    });
  }
}
