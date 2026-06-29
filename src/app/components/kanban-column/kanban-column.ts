import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, input, output } from '@angular/core';
import { calculateColumnTotal, formatCurrency } from '../../helpers/order.helpers';
import { Order, OrderStatus } from '../../types/order.type';
import { OrderCard } from '../order-card/order-card';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [DragDropModule, OrderCard],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  readonly label = input.required<string>();
  readonly status = input.required<OrderStatus>();
  readonly orders = input.required<Order[]>();
  readonly dropped = output<CdkDragDrop<Order[]>>();

  readonly totalFormatted = computed(() => {
    const total = calculateColumnTotal(this.orders());
    const formatted = formatCurrency(total);

    return formatted;
  });

  readonly handleDrop = (event: CdkDragDrop<Order[]>): void => {
    this.dropped.emit(event);
  };
}
