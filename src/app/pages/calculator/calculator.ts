import { ResultCalculation } from './../../services/pricing';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Pricing } from '../../services/pricing';

// Decorator para definir esta classe como um componente Angular, que pode ser usado na aplicação
@Component({
  selector: 'app-calculator', // O seletor é o nome da tag HTML que será usada para incluir este componente em outros templates
  standalone: true, // Isso indica que este componente é independente e não precisa ser declarado em um módulo Angular, o que simplifica a estrutura do projeto
  imports: [CommonModule, ReactiveFormsModule], // Esses são os módulos que este componente precisa para funcionar, como CommonModule para diretivas comuns e ReactiveFormsModule para trabalhar com formulários reativos
  templateUrl: './calculator.html', // O caminho para o template HTML que define a visualização para este componente
  styleUrl: './calculator.scss', // O caminho para o arquivo SCSS que define os estilos para este componente
})
export class Calculator {
  // Injeção de dependência para o serviço de precificação, que será usado para realizar os cálculos com base nos dados do formulário
  private readonly pricingService = inject(Pricing);

  // Signal para armazenar o resultado do cálculo, que é um objeto do tipo ResultCalculation. O signal é uma forma reativa de armazenar dados, e quando o valor do signal é atualizado, a interface do usuário que depende desse valor será automaticamente atualizada para refletir as mudanças.
  readonly result = signal<ResultCalculation>({
    costProduction: 0,
    suggestedPrice: 0,
    profit: 0,
  })

  // Cria um formulário reativo com valores padrões
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

  // Metodo para realizar o cálculo quando o formulário é enviado
  constructor() {
    this.updateResult(); // Inicializa o resultado com os valores padrões do formulário

    // Subscribe to form value changes to update the result whenever the user changes any input
    // .subscribe() é usado para ouvir as mudanças no formulário, e toda vez que o formulário é atualizado, a função dentro do subscribe é chamada, que por sua vez chama o método updateResult para recalcular os resultados com base nos novos valores do formulário
    this.form.valueChanges.subscribe(() => {
      this.updateResult();
    });
  }

  private updateResult() {
    // getRawValue() pega o valor atual do formulário, mesmo que ele esteja desabilitado, e retorna um objeto com os valores de cada controle do formulário. Esses valores são então passados para o método calculate do serviço de precificação para obter os novos resultados com base nos dados do formulário
    const data = this.form.getRawValue();
    const newResult = this.pricingService.calculate(data);

    // Atualiza o signal com o novo resultado, o que acionará uma atualização no template para exibir os novos resultados
    this.result.set(newResult);
  }
}
