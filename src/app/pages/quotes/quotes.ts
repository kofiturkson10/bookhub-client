import { Component, inject, signal, OnInit } from '@angular/core';
import { QuoteService } from '../../services/quote';
import { Quote } from '../../models/quote';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quotes.html',
})
export class Quotes implements OnInit {
  private quoteService = inject(QuoteService);

  quotes = signal<Quote[]>([]);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.quoteService.getQuotes().subscribe({
      next: (data) => this.quotes.set(data),
      error: () => this.error.set('Kunde inte hämta citat.'),
    });
  }

  deleteQuote(id: number): void {                    
    if (!confirm('Är du säker på att du vill radera citatet?')) return;
    // <-- ny metod, här inne
    this.quoteService.deleteQuote(id).subscribe({
      next: () => this.quotes.update(list => list.filter(q => q.id !== id)),
      error: (err) => console.error('Kunde inte radera citatet', err),
    });
  }
}