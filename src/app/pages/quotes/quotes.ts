import { Component, inject, signal, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote';
import { Quote } from '../../models/quote';
import { RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss'
})
export class Quotes implements OnInit {
  private quoteService = inject(QuoteService);
  private fb = inject(FormBuilder);

  quotes = signal<Quote[]>([]);
  error = signal<string | null>(null);
  showAddModal = signal(false);
  saving = signal(false);
  addError = signal<string | null>(null);

  addForm = this.fb.nonNullable.group({
    text:   ['', [Validators.required, Validators.maxLength(500)]],
    author: ['', [Validators.required, Validators.maxLength(100)]],
  });

  openAdd(): void {
    this.addForm.reset();        // rensa ev. gammalt innehåll
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

    this.quoteService.addQuote(this.addForm.getRawValue()).subscribe({
      next: (created) => {
        this.quotes.update(list => [...list, created]);   // lägg till i listan
        this.saving.set(false);
        this.closeAdd();
      },
      error: () => {
        this.addError.set('Kunde inte spara citatet.');
        this.saving.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.quoteService.getQuotes().subscribe({
      next: (data) => this.quotes.set(data),
      error: () => this.error.set('Kunde inte hämta citat.'),
    });
  }

  deleteQuote(id: number): void {
    if (!confirm('Är du säker på att du vill radera citatet?')) return;

    this.quoteService.deleteQuote(id).subscribe({
      next: () => this.quotes.update(list => list.filter(q => q.id !== id)),
      error: (err) => console.error('Kunde inte radera citatet', err),
    });
  }
}