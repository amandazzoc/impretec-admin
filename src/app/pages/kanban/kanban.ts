import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, inject, OnInit, signal } from '@angular/core';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import {
  ItemCheckEvent,
  OrderDetailsModal,
} from '../../components/order-details-modal/order-details-modal';
import { OrderEditModal } from '../../components/order-edit-modal/order-edit-modal';
import {
  createEmptyColumns,
  groupOrdersByStatus,
  STATUS_COLUMNS,
} from '../../helpers/order.helpers';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../types/order.type';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [DragDropModule, KanbanColumn, OrderDetailsModal, OrderEditModal],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss',
})
export class Kanban implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly statusColumns = STATUS_COLUMNS;
  readonly columns = signal<Record<OrderStatus, Order[]>>(createEmptyColumns());
  readonly isLoading = signal(false);

  readonly selectedOrder = signal<Order | null>(null);
  readonly editingOrder = signal<Order | null>(null);

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

  readonly handleOrderSelected = (order: Order): void => {
    this.selectedOrder.set(order);
  };

  readonly closeOrderDetails = (): void => {
    this.selectedOrder.set(null);
  };

  readonly handleItemChecked = async (event: ItemCheckEvent): Promise<void> => {
    const { itemId, isChecked } = event;

    // Atualiza o signal localmente (otimista, sem reload)
    const updatedColumns = { ...this.columns() };

    for (const status in updatedColumns) {
      updatedColumns[status as OrderStatus] = updatedColumns[status as OrderStatus].map((order) => {
        const hasItem = order.items.some((i) => i.id === itemId);
        if (!hasItem) return order;

        return {
          ...order,
          items: order.items.map((i) => (i.id === itemId ? { ...i, isChecked } : i)),
        };
      });
    }

    this.columns.set(updatedColumns);

    // Se o pedido selecionado for o mesmo, atualiza ele também
    const selected = this.selectedOrder();
    if (selected) {
      const updatedItems = selected.items.map((i) => (i.id === itemId ? { ...i, isChecked } : i));
      this.selectedOrder.set({ ...selected, items: updatedItems });
    }

    // Persiste no banco
    await this.orderService.toggleItemCheck(itemId, isChecked);
  };

  readonly openEditModal = (): void => {
    this.editingOrder.set(this.selectedOrder());
    this.selectedOrder.set(null);
  };

  readonly closeEditModal = (): void => {
    this.editingOrder.set(null);
  };

  readonly handleOrderSaved = (updatedOrder: Order): void => {
    const updatedColumns = { ...this.columns() };

    for (const status in updatedColumns) {
      updatedColumns[status as OrderStatus] = updatedColumns[status as OrderStatus].map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      );
    }

    const oldStatus = this.editingOrder()?.status;
    if (oldStatus && oldStatus !== updatedOrder.status) {
      updatedColumns[oldStatus] = updatedColumns[oldStatus].filter((o) => o.id !== updatedOrder.id);
      updatedColumns[updatedOrder.status] = [updatedOrder, ...updatedColumns[updatedOrder.status]];
    }

    this.columns.set(updatedColumns);
    this.editingOrder.set(null);
  };
}
