import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: Books },
  { path: 'quotes', component: Quotes },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'books' },
];