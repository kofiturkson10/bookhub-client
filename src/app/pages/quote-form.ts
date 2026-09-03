import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuoteService } from '../services/quote';

@Component({
  selector: 'app-quote-form',
  imports: [ReactiveFormsModule],
  templateUrl: './quote-form.html',
})
export class QuoteForm {
  private quoteService = inject(QuoteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  quoteId?: number;

  form = inject(FormBuilder).nonNullable.group({
    text: ['', [Validators.required, Validators.maxLength(500)]],
    author: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.quoteId = Number(idParam);
      this.quoteService.getQuote(this.quoteId).subscribe({
        next: (quote) => this.form.patchValue({
          text: quote.text,
          author: quote.author,
        }),
        error: (err) => console.error('Kunde inte hämta citatet', err),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    if (this.quoteId) {
      this.quoteService.updateQuote(this.quoteId, this.form.getRawValue()).subscribe({
        next: () => this.router.navigate(['/quotes']),
        error: (err) => console.error('Kunde inte uppdatera citatet', err),
      });
    } else {
      this.quoteService.addQuote(this.form.getRawValue()).subscribe({
        next: () => this.router.navigate(['/quotes']),
        error: (err) => console.error('Kunde inte skapa citatet', err),
      });
    }
  }
}