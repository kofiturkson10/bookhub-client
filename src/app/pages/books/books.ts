import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../services/book';
import { Book } from '../../models/book';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [RouterLink, DatePipe],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})

export class Books implements OnInit {
  private bookService = inject(BookService);
  books: Book[] = [];

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Kunde inte hämta böcker', err)
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
