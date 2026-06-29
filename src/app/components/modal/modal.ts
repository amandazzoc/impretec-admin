import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  readonly title = input<string>();
  readonly closed = output<void>();

  readonly handleClose = (): void => {
    this.closed.emit();
  };

  readonly handleBackdropClick = (): void => {
    this.closed.emit();
  };
}
