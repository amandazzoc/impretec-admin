import { Component, computed, input } from '@angular/core';
import { Order } from '../../types/order.type';
import { calculateTotalPrice, formatCurrency, formatDate } from '../../helpers/order.helpers';

@Component({
  selector: 'app-order-card',
  imports: [],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
})
export class OrderCard {
  readonly order = input.required<Order>();

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
}
