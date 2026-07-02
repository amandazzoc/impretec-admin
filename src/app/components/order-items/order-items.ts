import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DraftOrderItem } from '../../types/order.type';
import { calculateItemSubtotal, formatCurrency, isFormValid } from '../../helpers/order.helpers';
import { FormField } from '../form-field/form-field';
import { Button } from '../button/button';
import { CurrencyMaskPipe } from "../../pipes/currency-mask.pipe";

export type EditItemEvent = {
  itemId: string;
  updated: Omit<DraftOrderItem, 'id'>;
};

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [FormsModule, FormField, Button, CurrencyMaskPipe],
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  readonly items = input.required<DraftOrderItem[]>();
  readonly removeItem = output<string>();
  readonly editItem = output<EditItemEvent>(); // ← novo

  // Estado de edição
  readonly editingItemId = signal<string | null>(null);
  readonly editDescription = signal('');
  readonly editPrice = signal(0);
  readonly editQuantity = signal(1);
  readonly editObservations = signal('');

  readonly canSaveEdit = computed(() =>
    isFormValid(this.editDescription(), this.editPrice(), this.editQuantity()),
  );

  readonly calculateSubtotal = (item: DraftOrderItem): number => {
    return calculateItemSubtotal(item);
  };

  readonly formatCurrency = (value: number): string => {
    return formatCurrency(value);
  };

  readonly handleRemoveItem = (itemId: string): void => {
    this.removeItem.emit(itemId);
  };

  readonly handleStartEdit = (item: DraftOrderItem): void => {
    this.editingItemId.set(item.id);
    this.editDescription.set(item.description);
    this.editPrice.set(item.price);
    this.editQuantity.set(item.quantity);
    this.editObservations.set(item.observations ?? '');
  };

  readonly handleCancelEdit = (): void => {
    this.editingItemId.set(null);
  };

  readonly handleSaveEdit = (itemId: string): void => {
    this.editItem.emit({
      itemId,
      updated: {
        description: this.editDescription(),
        price: this.editPrice(),
        quantity: this.editQuantity(),
        observations: this.editObservations() || null,
      },
    });
    this.editingItemId.set(null);
  };
}
