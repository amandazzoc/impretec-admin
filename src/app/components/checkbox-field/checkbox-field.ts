import { Component, input } from '@angular/core';

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  templateUrl: './checkbox-field.html',
  styleUrl: './checkbox-field.scss',
})
export class CheckboxField {
  readonly label = input.required<string>();
}
