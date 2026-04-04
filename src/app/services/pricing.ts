import { Injectable } from '@angular/core';

export interface Data {
  timeHours: number,
  weightG: number,
  filamentCostPerKg: number,
  printerPowerW: number,
  kwhCost: number,
  packagingCost: number,
  profitMargin: number,
  riskFailure: boolean,
  needPaint: boolean,
  hoursPaint: number,
  costHourPaint: number,
}

export interface ResultCalculation {
  costProduction: number,
  suggestedPrice: number,
  profit: number,
}

// Decorator para tornar este serviço disponível para ser usado em outras partes da aplicação
@Injectable({
  // Isso significa que o serviço será um singleton e pode ser injetado em qualquer componente ou serviço na aplicação
  providedIn: 'root',
})
export class Pricing {
  private readonly PRINTER_VALUE = 4500;
  private readonly USEFUL_LIFE_TIME = 20000; // in hours
  private readonly COST_AMORTIZATION_HOUR = this.PRINTER_VALUE / this.USEFUL_LIFE_TIME;

  private readonly PAINTING_MATERIAL_FEE = 5;

  // O construtor é vazio porque não precisamos injetar nenhuma dependência para este serviço
  constructor() {}

  calculate(data: Data): ResultCalculation {
    const costMaterial = (data.filamentCostPerKg / 1000) * data.weightG;
    const costEnergy = ((data.printerPowerW / 1000) * data.timeHours) * data.kwhCost;
    const costAmortization = this.COST_AMORTIZATION_HOUR * data.timeHours;

    const costPrinting = costMaterial + costEnergy + costAmortization + data.packagingCost;

    // Adiciona um custo extra de 20% se houver risco de falha, para cobrir possíveis perdas e retrabalhos
    const costWithRisk = data.riskFailure ? costPrinting * 1.2 : costPrinting;

    const costPainting = data.needPaint ? (data.hoursPaint * data.costHourPaint) : 0;
    const costMaterialPainting = data.needPaint ? this.PAINTING_MATERIAL_FEE : 0;
    const costTotalPainting = costPainting + costMaterialPainting;

    const costProduction = costWithRisk + costTotalPainting;

    const priceWithProfit = costProduction + (costProduction * (data.profitMargin / 100));
    
    // Adiciona um markup de 50% ao preço com lucro se o item precisar de pintura, para cobrir os custos adicionais e o valor percebido do produto finalizado
    const priceSuggested = data.needPaint ? priceWithProfit * 1.5 : priceWithProfit;

    return {
      costProduction: parseFloat(costProduction.toFixed(2)),
      suggestedPrice: parseFloat(priceSuggested.toFixed(2)),
      profit: parseFloat((priceSuggested - costProduction).toFixed(2)),
    };
  }
}
