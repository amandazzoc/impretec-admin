import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order.type';
import { formatCurrency, formatDate, formatOrderStatus } from '../../helpers/order.helpers';
import { calculateTotalPrice } from '../../helpers/order.helpers';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-archived-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './archived-orders.html',
  styleUrl: './archived-orders.scss',
})
export class ArchivedOrders implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);
  readonly currentPage = signal(1);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.orders().length / PAGE_SIZE)));

  readonly paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.orders().slice(start, start + PAGE_SIZE);
  });

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.loadOrders();
  }

  readonly loadOrders = async (): Promise<void> => {
    this.isLoading.set(true);
    const orders = await this.orderService.getArchivedOrders();
    this.orders.set(orders);
    this.isLoading.set(false);
  };

  readonly formatTotal = (order: Order): string => formatCurrency(calculateTotalPrice(order.items));

  readonly formatDate = (date: string): string => formatDate(date);
  readonly formatStatus = (order: Order): string => formatOrderStatus(order.status);

  readonly goToPage = (page: number): void => {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  };
}
