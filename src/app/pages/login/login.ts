import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly handleSubmit = async (): Promise<void> => {
    this.isLoading.set(true);
    this.error.set(null);

    const error = await this.authService.signIn(this.email(), this.password());

    this.isLoading.set(false);

    if (error) {
      this.error.set('Email ou senha incorretos.');
    } else {
      this.router.navigate(['/']);
    }
  };
}
