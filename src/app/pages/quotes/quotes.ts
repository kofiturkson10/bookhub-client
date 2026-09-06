import { Component, inject, signal, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote';
import { Quote } from '../../models/quote';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [ReactiveFormsModule],
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
  editingId = signal<number | null>(null);
  pendingDelete = signal<Quote | null>(null);

  addForm = this.fb.nonNullable.group({
    text:   ['', [Validators.required, Validators.maxLength(500)]],
    author: ['', [Validators.required, Validators.maxLength(100)]],
  });

  openAdd(): void {
    this.editingId.set(null);      // skapa-läge
    this.addForm.reset();
    this.addError.set(null);
    this.showAddModal.set(true);
  }

  closeAdd(): void {
    this.showAddModal.set(false);
    this.editingId.set(null);      // städa läget
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

  openEdit(quote: Quote): void {
    this.editingId.set(quote.id);
    this.addError.set(null);
    this.addForm.setValue({ text: quote.text, author: quote.author });
    this.showAddModal.set(true);
  }

  submitEdit(): void {
    const id = this.editingId();
    if (id === null || this.addForm.invalid || this.saving()) return;

    this.saving.set(true);
    this.addError.set(null);

    this.quoteService.updateQuote(id, this.addForm.getRawValue()).subscribe({
      next: () => {
        // updateQuote returnerar void → uppdatera posten lokalt från formulärets värden
        const values = this.addForm.getRawValue();
        this.quotes.update(list =>
          list.map(q => q.id === id ? { ...q, ...values } : q)
        );
        this.saving.set(false);
        this.closeAdd();
      },
      error: () => {
        this.addError.set('Kunde inte uppdatera citatet.');
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

  askDelete(quote: Quote): void {
    this.pendingDelete.set(quote);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const quote = this.pendingDelete();
    if (!quote) return;

    this.quoteService.deleteQuote(quote.id).subscribe({
      next: () => {
        this.quotes.update(list => list.filter(q => q.id !== quote.id));
        this.pendingDelete.set(null);
      },
      error: (err) => {
        console.error('Kunde inte radera citatet', err);
        this.pendingDelete.set(null);
      },
    });
  }
}