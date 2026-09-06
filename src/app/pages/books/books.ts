import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit {
  private bookService = inject(BookService);
  private fb = inject(FormBuilder);

  books: Book[] = [];

  showAddModal = signal(false);
  saving = signal(false);
  addError = signal<string | null>(null);

  addForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publishedDate: ['', Validators.required],
  });

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Kunde inte hämta böcker', err)
    });
  }

  openAdd(): void {
    this.addForm.reset();
    this.addError.set(null);
    this.showAddModal.set(true);
  }

  closeAdd(): void {
    this.showAddModal.set(false);
  }

  submitAdd(): void {
    if (this.addForm.invalid || this.saving()) return;

    this.saving.set(true);
    this.addError.set(null);

    this.bookService.createBook(this.addForm.getRawValue()).subscribe({
      next: (created) => {
        this.books = [...this.books, created];
        this.saving.set(false);
        this.closeAdd();
      },
      error: () => {
        this.addError.set('Kunde inte spara boken.');
        this.saving.set(false);
      },
    });
  }

  deleteBook(id: number): void {
    if (!confirm('Är du säker på att du vill radera boken?')) return;

    this.bookService.deleteBook(id).subscribe({
      next: () => this.books = this.books.filter(b => b.id !== id),
      error: (err) => console.error('Kunde inte radera boken', err)
    });
  }
}