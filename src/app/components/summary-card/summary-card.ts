import { Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  imports: [],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly highlight = input(false);
}
