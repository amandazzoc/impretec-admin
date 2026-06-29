import { Component, input, output } from '@angular/core';
import { DraftOrderItem } from '../../types/order.type';
import { calculateItemSubtotal, formatCurrency } from '../../helpers/order.helpers';

@Component({
  selector: 'app-order-items',
  standalone: true,
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  readonly items = input.required<DraftOrderItem[]>();
  readonly removeItem = output<string>();

  readonly calculateSubtotal = (item: DraftOrderItem): number => {
    const subtotal = calculateItemSubtotal(item);

    return subtotal;
  };

  readonly formatCurrency = (value: number): string => {
    const formattedValue = formatCurrency(value);

    return formattedValue;
  };

  readonly handleRemoveItem = (itemId: string): void => {
    this.removeItem.emit(itemId);
  };
}
