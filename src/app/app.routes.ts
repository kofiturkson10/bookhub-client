import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';
import { Login } from './pages/login/login';
import { BookForm } from './pages/book-form';
import { QuoteForm } from './pages/quote-form';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'books', component: Books, canActivate: [authGuard] },
  { path: 'books/new', component: BookForm, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: BookForm, canActivate: [authGuard] },
  { path: 'quotes', component: Quotes, canActivate: [authGuard] },
  { path: 'quotes/new', component: QuoteForm, canActivate: [authGuard] },
  { path: 'quotes/:id/edit', component: QuoteForm, canActivate: [authGuard] },
  { path: '**', redirectTo: 'books' },
];