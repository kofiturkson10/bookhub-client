import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';

@Component({
  selector: 'app-books',
  imports: [DatePipe, ReactiveFormsModule],
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
  editingId = signal<number | null>(null);
  pendingDelete = signal<Book | null>(null);

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
    this.editingId.set(null);
    this.addForm.reset();
    this.addError.set(null);
    this.showAddModal.set(true);
  }

  closeAdd(): void {
    this.showAddModal.set(false);
    this.editingId.set(null);
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

  openEdit(book: Book): void {
    this.editingId.set(book.id);
    this.addError.set(null);
    this.addForm.setValue({
      title: book.title,
      author: book.author,
      publishedDate: book.publishedDate,
    });
    this.showAddModal.set(true);
  }

  submitEdit(): void {
    const id = this.editingId();
    if (id === null || this.addForm.invalid || this.saving()) return;

    this.saving.set(true);
    this.addError.set(null);

    this.bookService.updateBook(id, this.addForm.getRawValue()).subscribe({
      next: () => {
        const values = this.addForm.getRawValue();
        this.books = this.books.map(b => b.id === id ? { ...b, ...values } : b);
        this.saving.set(false);
        this.closeAdd();
      },
      error: () => {
        this.addError.set('Kunde inte uppdatera boken.');
        this.saving.set(false);
      },
    });
  }

  askDelete(book: Book): void {
    this.pendingDelete.set(book);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const book = this.pendingDelete();
    if (!book) return;

    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.books = this.books.filter(b => b.id !== book.id);
        this.pendingDelete.set(null);
      },
      error: (err) => {
        console.error('Kunde inte radera boken', err);
        this.pendingDelete.set(null);
      },
    });
  }
}