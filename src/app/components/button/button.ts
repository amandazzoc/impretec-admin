import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './Button.html',
  styleUrl: './Button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly isLoading = input(false);
  readonly disabled = input(false);
  readonly loadingLabel = input('Salvando...');
  readonly clicked = output<void>();

  readonly handleClick = (): void => {
    this.clicked.emit();
  };
}
