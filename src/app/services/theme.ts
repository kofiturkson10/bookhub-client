import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  readonly theme = signal<Theme>(this.readInitial());

  private readInitial(): Theme {
    const saved = localStorage.getItem(this.storageKey);
    return saved === 'dark' ? 'dark' : 'light';
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem(this.storageKey, next);
    this.apply(next);
  }

  apply(theme: Theme = this.theme()): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}