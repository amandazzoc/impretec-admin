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

// Decorator to make this service available to be used in other parts of the application
@Injectable({
  providedIn: 'root', // This means that the service will be a singleton and can be injected into any component or service in the application
})
export class Pricing {
  private readonly PRINTER_VALUE = 4500;
  private readonly USEFUL_LIFE_TIME = 20000; // in hours
  private readonly COST_AMORTIZATION_HOUR = this.PRINTER_VALUE / this.USEFUL_LIFE_TIME;

  private readonly PAINTING_MATERIAL_FEE = 5;

  constructor() {} // The constructor is empty because we don't need to inject any dependencies for this service

  calculate(data: Data): ResultCalculation {
    const costMaterial = (data.filamentCostPerKg / 1000) * data.weightG;
    const costEnergy = ((data.printerPowerW / 1000) * data.timeHours) * data.kwhCost;
    const costAmortization = this.COST_AMORTIZATION_HOUR * data.timeHours;

    const costPrinting = costMaterial + costEnergy + costAmortization + data.packagingCost;

    const costWithRisk = data.riskFailure ? costPrinting * 1.2 : costPrinting; // Adding 20% if there's a risk of failure

    const costPainting = data.needPaint ? (data.hoursPaint * data.costHourPaint) : 0;
    const costMaterialPainting = data.needPaint ? this.PAINTING_MATERIAL_FEE : 0;
    const costTotalPainting = costPainting + costMaterialPainting;

    const costProduction = costWithRisk + costTotalPainting;

    const priceWithProfit = costProduction + (costProduction * (data.profitMargin / 100));
    
    const priceSuggested = data.needPaint ? priceWithProfit * 1.5 : priceWithProfit; // Adding 15% if painting is needed

    return {
      costProduction: parseFloat(costProduction.toFixed(2)),
      suggestedPrice: parseFloat(priceSuggested.toFixed(2)),
      profit: parseFloat((priceSuggested - costProduction).toFixed(2)),
    };
  }
}
