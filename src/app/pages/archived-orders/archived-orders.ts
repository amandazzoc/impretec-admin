import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order.type';
import {
  calculateTotalPrice,
  formatCurrency,
  formatDate,
  formatOrderStatus,
} from '../../helpers/order.helpers';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-archived-orders',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './archived-orders.html',
  styleUrl: './archived-orders.scss',
})
export class ArchivedOrders implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);
  readonly currentPage = signal(1);

  // Filtros
  readonly searchName = signal('');
  readonly filterDateStart = signal('');
  readonly filterDateEnd = signal('');

  readonly filteredOrders = computed(() => {
    const name = this.searchName().toLowerCase().trim();
    const start = this.filterDateStart();
    const end = this.filterDateEnd();

    return this.orders().filter((order) => {
      const matchesName = name ? order.clientName.toLowerCase().includes(name) : true;

      const orderDate = new Date(order.createdAt);

      const matchesStart = start ? orderDate >= new Date(start) : true;

      const matchesEnd = end
        ? orderDate <= new Date(new Date(end).setHours(23, 59, 59, 999))
        : true;

      return matchesName && matchesStart && matchesEnd;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredOrders().length / PAGE_SIZE)),
  );

  readonly paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredOrders().slice(start, start + PAGE_SIZE);
  });

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  readonly hasActiveFilters = computed(
    () => !!this.searchName() || !!this.filterDateStart() || !!this.filterDateEnd(),
  );

  ngOnInit(): void {
    this.loadOrders();
  }

  readonly loadOrders = async (): Promise<void> => {
    this.isLoading.set(true);
    const orders = await this.orderService.getArchivedOrders();
    this.orders.set(orders);
    this.isLoading.set(false);
  };

  readonly clearFilters = (): void => {
    this.searchName.set('');
    this.filterDateStart.set('');
    this.filterDateEnd.set('');
    this.currentPage.set(1);
  };

  // Reseta pra página 1 sempre que filtro mudar
  readonly onFilterChange = (): void => {
    this.currentPage.set(1);
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
