import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';
import { Login } from './pages/login/login';
import { BookForm } from './pages/book-form';

export const routes: Routes = [
  { path: '', component: Books},
  { path: 'books/new', component: BookForm },
  { path: 'books/:id/edit', component: BookForm },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: Books },
  { path: 'quotes', component: Quotes },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'books' },
];