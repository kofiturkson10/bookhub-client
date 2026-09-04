import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './nav/nav'
import { ThemeService } from './services/theme';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bookhub-client');

  private theme = inject(ThemeService);

  constructor() {
    this.theme.apply();
  }
}
