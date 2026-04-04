import { ResultCalculation } from './../../services/pricing';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pricing } from '../../services/pricing';

// Decorator to define this class as an Angular component, which can be used in the application
@Component({
  selector: 'app-calculator', // The selector is the HTML tag that will be used to include this component in other parts of the application
  standalone: true, // This means that the component is self-contained and does not require a module to be declared in order to be used
  imports: [CommonModule, ReactiveFormsModule], // These are the modules that this component depends on. CommonModule provides common directives like ngIf and ngFor, while ReactiveFormsModule provides support for reactive forms
  templateUrl: './calculator.html', // The path to the HTML template that defines the view for this component
  styleUrl: './calculator.scss', // The path to the SCSS file that defines the styles for this component
})
export class Calculator {
  // Injecting the Pricing service into the component's constructor, which allows us to use the service's methods in this component
  private readonly pricingService = inject(Pricing);

  // Signal to hold the result of the calculation, which can be used in the template to display the results
  // Comparado com o useState do React, o signal é uma forma de armazenar e gerenciar o estado em um componente Angular
  readonly result = signal<ResultCalculation>({
    costProduction: 0,
    suggestedPrice: 0,
    profit: 0,
  })

  // Create reactive form with default values
  readonly form = new FormGroup({
    // FormControl é usado para criar um controle de formulário individual, que pode ser usado para capturar e validar a entrada do usuário
    timeHours: new FormControl(0, { nonNullable: true }),
    weightG: new FormControl(100, { nonNullable: true }),
    filamentCostPerKg: new FormControl(120, { nonNullable: true }),
    printerPowerW: new FormControl(360, { nonNullable: true }),
    kwhCost: new FormControl(1, { nonNullable: true }),
    packagingCost: new FormControl(2, { nonNullable: true }),
    profitMargin: new FormControl(65, { nonNullable: true }),
    riskFailure: new FormControl(false, { nonNullable: true }),
    needPaint: new FormControl(true, { nonNullable: true }),
    hoursPaint: new FormControl(2, { nonNullable: true }),
    costHourPaint: new FormControl(10, { nonNullable: true }),
  })

  // Method to perform the calculation when the form is submitted
  constructor() {
    this.updateResult(); // Initial calculation with default values

    // Subscribe to form value changes to update the result whenever the user changes any input
    this.form.valueChanges.subscribe(() => {
      this.updateResult();
    });
  }

  private updateResult() {
    // getRawValue() get the current value of the form
    const data = this.form.getRawValue();
    const newResult = this.pricingService.calculate(data);

    // Update the signal with the new result, which will trigger an update in the template to display the new results
    this.result.set(newResult);
  }
}
