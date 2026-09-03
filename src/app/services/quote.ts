import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quote } from '../models/quote';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7000/api/quotes';

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.baseUrl);
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.baseUrl}/${id}`);
  }

  addQuote(quote: { text: string; author: string }): Observable<Quote> {
    return this.http.post<Quote>(this.baseUrl, quote);
  }

  updateQuote(id : number, quote: { text: string; author: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, quote);
  }

  deleteQuote(id : number) : Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}