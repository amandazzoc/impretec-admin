import { Component, computed, input, output } from '@angular/core';
import { Order, PaymentStatus } from '../../types/order.type';
import { calculateTotalPrice, formatCurrency, formatDate, getPaymentStatus } from '../../helpers/order.helpers';

@Component({
  selector: 'app-order-card',
  imports: [],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
})
export class OrderCard {
  readonly order = input.required<Order>();
  readonly selected = output<Order>();

  readonly totalFormatted = computed(() => {
    const total = calculateTotalPrice(this.order().items);
    const formatted = formatCurrency(total);

    return formatted;
  });

  readonly deadlineFormatted = computed(() => {
    const formatted = formatDate(this.order().deadline);

    return formatted;
  });

  readonly itemsLabel = computed(() => {
    const count = this.order().items.length;
    const label = count === 1 ? `${count} item` : `${count} itens`;

    return label;
  });

  readonly handleClick = (): void => {
    this.selected.emit(this.order());
  };

  readonly checkedLabel = computed(() => {
    const items = this.order().items;
    const checked = items.filter((i) => i.isChecked).length;
    return `${checked}/${items.length}`;
  });

  readonly allChecked = computed(() => this.order().items.every((i) => i.isChecked));

  readonly paymentStatus = computed((): PaymentStatus => {
    const total = calculateTotalPrice(this.order().items);
    return getPaymentStatus(this.order().amountPaid, total);
  });

  readonly paymentLabel = computed((): string => {
    const status = this.paymentStatus();
    if (status === 'paid') return 'Pago';
    if (status === 'partial') return 'Pago parcialmente';
    return 'Não pago';
  });
}
