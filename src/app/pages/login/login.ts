import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  errorMessage = signal<string | null >(null);
  registered = signal(history.state?.registered === true);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => this.errorMessage.set('Fel användarnamn eller lösenord.')
    });
  }
}
