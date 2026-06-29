import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, inject, OnInit, signal } from '@angular/core';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import {
  createEmptyColumns,
  groupOrdersByStatus,
  STATUS_COLUMNS,
} from '../../helpers/order.helpers';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../types/order.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DragDropModule, KanbanColumn],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly statusColumns = STATUS_COLUMNS;
  readonly columns = signal<Record<OrderStatus, Order[]>>(createEmptyColumns());
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  readonly loadOrders = async (): Promise<void> => {
    this.isLoading.set(true);

    const orders = await this.orderService.getOrders();
    const grouped = groupOrdersByStatus(orders);

    this.columns.set(grouped);
    this.isLoading.set(false);
  };

  readonly handleDrop = async (event: CdkDragDrop<Order[]>): Promise<void> => {
    const isSameContainer = event.previousContainer === event.container;

    if (isSameContainer) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const previousStatus = event.previousContainer.id as OrderStatus;
    const currentStatus = event.container.id as OrderStatus;

    const refreshedColumns = {
      ...this.columns(),
      [previousStatus]: [...event.previousContainer.data],
      [currentStatus]: [...event.container.data],
    };

    this.columns.set(refreshedColumns);

    const movedOrder = event.item.data as Order;
    const shouldUpdateStatus = !isSameContainer;

    if (shouldUpdateStatus) {
      await this.orderService.updateOrderStatus(movedOrder.id, currentStatus);
    }
  };
}
