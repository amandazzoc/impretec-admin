import { Component, computed, input, output } from '@angular/core';
import { Modal } from '../modal/modal';
import { Order, OrderItem } from '../../types/order.type';
import {
  calculateTotalPrice,
  calculateItemSubtotal,
  formatCurrency,
  formatDate,
  formatOrderStatus,
  getPaymentStatus,
} from '../../helpers/order.helpers';
import { CheckboxField } from '../checkbox-field/checkbox-field';

export type ItemCheckEvent = {
  itemId: string;
  isChecked: boolean;
};

export type AmountPaidEvent = {
  orderId: string;
  amountPaid: number;
};

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [Modal, CheckboxField],
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.scss',
})
export class OrderDetailsModal {
  readonly order = input.required<Order>();
  readonly closed = output<void>();
  readonly itemChecked = output<ItemCheckEvent>();
  readonly editRequested = output<void>();
  readonly amountPaidChanged = output<AmountPaidEvent>();

  readonly statusLabel = computed(() => formatOrderStatus(this.order().status));

  readonly deadlineFormatted = computed(() => formatDate(this.order().deadline));

  readonly totalFormatted = computed(() => formatCurrency(calculateTotalPrice(this.order().items)));

  readonly total = computed(() => calculateTotalPrice(this.order().items));

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

  readonly paymentStatus = computed(() => getPaymentStatus(this.order().amountPaid, this.total()));

  readonly amountPaidFormatted = computed(() => formatCurrency(this.order().amountPaid));

  readonly remainingFormatted = computed(() =>
    formatCurrency(Math.max(0, this.total() - this.order().amountPaid)),
  );

  readonly paymentPercentage = computed(() => {
    const total = this.total();
    if (total === 0) return 0;
    return Math.min(100, (this.order().amountPaid / total) * 100);
  });

  readonly handlePaymentSelect = (percentage: number): void => {
    const amount = (this.total() * percentage) / 100;
    this.amountPaidChanged.emit({ orderId: this.order().id, amountPaid: amount });
  };
}
