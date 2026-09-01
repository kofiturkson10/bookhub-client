import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.html',
})
export class BookForm {
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookId?: number;

  form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publishedDate: ['', Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = Number(idParam);
      this.bookService.getBook(this.bookId).subscribe({
        next: (book) => this.form.patchValue({
          title: book.title,
          author: book.author,
          publishedDate: book.publishedDate
        }),
        error: (err) => console.error('Kunde inte hämta boken', err)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    if (this.bookId) {
      this.bookService.updateBook(this.bookId, this.form.getRawValue()).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Kunde inte uppdatera boken', err)
      });
    } else {
      this.bookService.createBook(this.form.getRawValue()).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Kunde inte skapa boken', err)
      });
    }
  }
}