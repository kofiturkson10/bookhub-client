import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Nav } from './nav/nav';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bookhub-client');
  protected readonly showNav = signal(true);

  private theme = inject(ThemeService);
  private router = inject(Router);

  constructor() {
    this.theme.apply();

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const url = e.urlAfterRedirects;
        this.showNav.set(!(url.startsWith('/login') || url.startsWith('/register')));
      }
    });
  }
}