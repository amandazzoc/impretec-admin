import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-read-only-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './read-only-banner.html',
  styleUrl: './read-only-banner.scss',
})
export class ReadOnlyBanner {
  readonly authService = inject(AuthService);
}
