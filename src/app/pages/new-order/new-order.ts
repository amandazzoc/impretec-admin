import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderItems } from '../../components/order-items/order-items';
import {
  calculateTotalPrice,
  calculateTotalQuantity,
  createOrderItem,
  formatCurrency,
  isFormValid,
  isOrderValid,
} from '../../helpers/order.helpers';
import { OrderItem } from '../../types/order.type';
import { SummaryCard } from '../../components/summary-card/summary-card';
import { Button } from '../../components/button/button';
import { FormField } from '../../components/form-field/form-field';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [FormsModule, OrderItems, Card, FormField, Button, SummaryCard],
  templateUrl: './new-order.html',
  styleUrl: './new-order.scss',
})
export class NewOrder {
  readonly clientName = signal('');
  readonly deadline = signal('');

  readonly descriptionItem = signal('');
  readonly priceItem = signal(0);
  readonly quantityItem = signal(1);
  readonly observationsItem = signal('');

  readonly items = signal<OrderItem[]>([]);
  readonly isLoading = signal(false);

  readonly totalPrice = computed(() => {
    const total = calculateTotalPrice(this.items());

    return total;
  });

  readonly totalQuantity = computed(() => {
    const total = calculateTotalQuantity(this.items());

    return total;
  });

  readonly totalPriceFormatted = computed(() => {
    const formattedTotal = formatCurrency(this.totalPrice());

    return formattedTotal;
  });

  readonly canAddItem = computed(() => {
    const valid = isFormValid(this.descriptionItem(), this.priceItem(), this.quantityItem());

    return valid;
  });

  readonly canSubmitOrder = computed(() => {
    const valid = isOrderValid(this.clientName(), this.deadline(), this.items());

    return valid;
  });

  readonly cleanFormItem = (): void => {
    this.descriptionItem.set('');
    this.priceItem.set(0);
    this.quantityItem.set(1);
    this.observationsItem.set('');
  };

  readonly handleAddItem = (): void => {
    const item: OrderItem = createOrderItem(
      this.descriptionItem(),
      this.priceItem(),
      this.quantityItem(),
      this.observationsItem(),
    );
    const updatedItems = [...this.items(), item];
    this.items.set(updatedItems);
    this.cleanFormItem();
  };

  readonly handleRemoveItem = (itemId: string): void => {
    const updatedItems = this.items().filter((item) => item.id !== itemId);

    this.items.set(updatedItems);
  };

  readonly handleSubmitOrder = async (): Promise<void> => {
    this.isLoading.set(true);

    // TODO: Implement the logic to submit the order to the backend or perform any necessary actions.

    this.isLoading.set(false);
  };
}
