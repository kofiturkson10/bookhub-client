import { Component, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class BookService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7000/api/books';

    createBook(book: Omit<Book, 'id'>): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    getBook(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    updateBook(id: number, book: Omit<Book, 'id'>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, book);
    }

    deleteBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}