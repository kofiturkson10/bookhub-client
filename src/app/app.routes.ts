import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Quotes } from './pages/quotes/quotes';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'books', component: Books, canActivate: [authGuard] },
  { path: 'quotes', component: Quotes, canActivate: [authGuard] },
  { path: '**', redirectTo: 'books' },
];