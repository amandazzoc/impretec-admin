import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { AuthService } from './services/auth.service';
import { ReadOnlyBanner } from './components/read-only-banner/read-only-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, ReadOnlyBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('impretec-admin');
  readonly authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        document.body.classList.remove('has-banner');
      } else {
        document.body.classList.add('has-banner');
      }
    });
  }
}
