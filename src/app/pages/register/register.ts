import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Auth } from '../../auth';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export class Register {
    private fb = inject(FormBuilder);
    private auth = inject(Auth);
    private router = inject(Router);

    errorMessage = signal<string | null>(null);

    form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    onSubmit(): void {
        if (this.form.invalid) return;

        this.auth.register(this.form.getRawValue()).subscribe({
            next: () => this.router.navigate(['/login'], { state: { registered: true }}),
            error: (err) => {
                if (err.status === 409) {
                    this.errorMessage.set('Användarnamnet är redan taget.');
                } else {
                    this.errorMessage.set('Något gick fel. Försök igen.');
                }
            }
        });
    }
}