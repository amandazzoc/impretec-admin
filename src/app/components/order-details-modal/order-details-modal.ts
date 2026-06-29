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

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [Modal],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.scss',
})
export class OrderDetailsModal {
  readonly order = input.required<Order>();
  readonly closed = output<void>();

  readonly statusLabel = computed(() => {
    const label = formatOrderStatus(this.order().status);

    return label;
  });

  readonly deadlineFormatted = computed(() => {
    const formatted = formatDate(this.order().deadline);

    return formatted;
  });

  readonly totalFormatted = computed(() => {
    const total = calculateTotalPrice(this.order().items);
    const formatted = formatCurrency(total);

    return formatted;
  });

  readonly handleClosed = (): void => {
    this.closed.emit();
  };

  readonly formatItemSubtotal = (item: OrderItem): string => {
    const subtotal = calculateItemSubtotal(item);
    const formatted = formatCurrency(subtotal);

    return formatted;
  };
}
