import { Component, computed, input, output } from '@angular/core';
import { Modal } from '../modal/modal';
import { Order, OrderItem } from '../../types/order.type';
import {
  calculateTotalPrice,
  calculateItemSubtotal,
  formatCurrency,
  formatDate,
  formatOrderStatus,
} from '../../helpers/order.helpers';
import { CheckboxField } from '../checkbox-field/checkbox-field';
import { Button } from '../button/button';

export type ItemCheckEvent = {
  itemId: string;
  isChecked: boolean;
};

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [Modal, CheckboxField, Button],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.scss',
})
export class OrderDetailsModal {
  readonly order = input.required<Order>();
  readonly closed = output<void>();
  readonly itemChecked = output<ItemCheckEvent>();
  readonly editRequested = output<void>();

  readonly statusLabel = computed(() => formatOrderStatus(this.order().status));

  readonly deadlineFormatted = computed(() => formatDate(this.order().deadline));

  readonly totalFormatted = computed(() => formatCurrency(calculateTotalPrice(this.order().items)));

  readonly handleClosed = (): void => this.closed.emit();

  readonly handleEditClick = (): void => this.editRequested.emit();

  readonly formatItemSubtotal = (item: OrderItem): string => {
    const subtotal = calculateItemSubtotal(item);
    const formatted = formatCurrency(subtotal);

    return formatted;
  };

  readonly handleItemCheck = (item: OrderItem, event: Event): void => {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.itemChecked.emit({ itemId: item.id, isChecked });
  };
}
