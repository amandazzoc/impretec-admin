import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from '../modal/modal';
import { EditItemEvent, OrderItems } from '../order-items/order-items';
import { FormField } from '../form-field/form-field';
import { Button } from '../button/button';
import { Order, DraftOrderItem } from '../../types/order.type';
import { OrderService } from '../../services/order.service';
import { mapItemToNewOrderItem } from '../../services/order.helpers';
import {
  calculateTotalPrice,
  createOrderItem,
  formatCurrency,
  isFormValid,
  isOrderValid,
} from '../../helpers/order.helpers';

@Component({
  selector: 'app-order-edit-modal',
  standalone: true,
  imports: [Modal, FormsModule, OrderItems, FormField, Button],
  templateUrl: './order-edit-modal.html',
  styleUrl: './order-edit-modal.scss',
})
export class OrderEditModal implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly order = input.required<Order>();
  readonly closed = output<void>();
  readonly saved = output<Order>();

  readonly clientName = signal('');
  readonly deadline = signal('');

  readonly descriptionItem = signal('');
  readonly priceItem = signal(0);
  readonly quantityItem = signal(1);
  readonly observationsItem = signal('');

  readonly items = signal<DraftOrderItem[]>([]);
  readonly isLoading = signal(false);
  readonly submitError = signal(false);

  ngOnInit(): void {
    this.clientName.set(this.order().clientName);
    this.deadline.set(this.order().deadline);
    this.items.set(
      this.order().items.map((item) => ({
        id: item.id,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        observations: item.observations,
      })),
    );
  }

  readonly totalPriceFormatted = computed(() => {
    return formatCurrency(calculateTotalPrice(this.items()));
  });

  readonly canAddItem = computed(() => {
    return isFormValid(this.descriptionItem(), this.priceItem(), this.quantityItem());
  });

  readonly canSubmit = computed(() => {
    return isOrderValid(this.clientName(), this.deadline(), this.items());
  });

  readonly handleAddItem = (): void => {
    const item = createOrderItem(
      this.descriptionItem(),
      this.priceItem(),
      this.quantityItem(),
      this.observationsItem(),
    );
    this.items.update((items) => [...items, item]);
    this.descriptionItem.set('');
    this.priceItem.set(0);
    this.quantityItem.set(1);
    this.observationsItem.set('');
  };

  readonly handleRemoveItem = (itemId: string): void => {
    this.items.update((items) => items.filter((i) => i.id !== itemId));
  };

  readonly handleSave = async (): Promise<void> => {
    this.isLoading.set(true);
    this.submitError.set(false);

    const updatedOrder = await this.orderService.updateOrder(this.order().id, {
      clientName: this.clientName(),
      deadline: this.deadline(),
      items: this.items().map(mapItemToNewOrderItem),
    });

    this.isLoading.set(false);

    if (updatedOrder) {
      this.saved.emit(updatedOrder);
    } else {
      this.submitError.set(true);
    }
  };

  readonly handleClosed = (): void => {
    this.closed.emit();
  };

  readonly handleEditItem = (event: EditItemEvent): void => {
    this.items.update((items) =>
      items.map((item) => (item.id === event.itemId ? { ...item, ...event.updated } : item)),
    );
  };
}
