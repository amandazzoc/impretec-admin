import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order.type';
import { SummaryCard } from '../../components/summary-card/summary-card';
import { Card } from '../../components/card/card';
import { calculateTotalPrice, formatCurrency } from '../../helpers/order.helpers';

type MonthlyRevenue = {
  month: string;
  total: number;
};

type TopItem = {
  description: string;
  quantity: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SummaryCard, Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);

  readonly completedOrders = computed(() => this.orders().filter((o) => o.status === 'delivered'));

  readonly openOrders = computed(() =>
    this.orders().filter((o) => o.status === 'pending' || o.status === 'processing'),
  );

  readonly totalRevenue = computed(() => {
    const total = this.completedOrders().reduce((acc, o) => acc + calculateTotalPrice(o.items), 0);
    return formatCurrency(total);
  });

  readonly openOrdersCount = computed(() => this.openOrders().length);

  readonly averageTicket = computed(() => {
    const completed = this.completedOrders();
    if (completed.length === 0) return formatCurrency(0);
    const total = completed.reduce((acc, o) => acc + calculateTotalPrice(o.items), 0);
    return formatCurrency(total / completed.length);
  });

  readonly completionRate = computed(() => {
    const total = this.orders().filter((o) => o.status !== 'cancelled').length;
    if (total === 0) return '0%';
    const rate = (this.completedOrders().length / total) * 100;
    return `${rate.toFixed(0)}%`;
  });

  readonly statusDistribution = computed(() => {
    const total = this.orders().length;
    if (total === 0) return [];

    return [
      { label: 'Pendente', status: 'pending', color: '#f59e0b' },
      { label: 'Em andamento', status: 'processing', color: '#3b82f6' },
      { label: 'Concluído', status: 'completed', color: '#22c55e' },
      { label: 'Entregue', status: 'delivered', color: '#8b5cf6' },
      { label: 'Cancelado', status: 'cancelled', color: '#ef4444' },
    ].map((s) => ({
      ...s,
      count: this.orders().filter((o) => o.status === s.status).length,
      percentage: (this.orders().filter((o) => o.status === s.status).length / total) * 100,
    }));
  });

  readonly monthlyRevenue = computed((): MonthlyRevenue[] => {
    const map = new Map<string, number>();

    for (const order of this.completedOrders()) {
      const date = new Date(order.deadline);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) ?? 0) + calculateTotalPrice(order.items));
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, total]) => {
        const [year, month] = key.split('-');
        const label = new Date(+year, +month - 1).toLocaleDateString('pt-BR', {
          month: 'short',
          year: '2-digit',
        });
        return { month: label, total };
      });
  });

  readonly topItems = computed((): TopItem[] => {
    const map = new Map<string, number>();

    for (const order of this.completedOrders()) {
      for (const item of order.items) {
        map.set(item.description, (map.get(item.description) ?? 0) + item.quantity);
      }
    }

    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([description, quantity]) => ({ description, quantity }));
  });

  readonly maxMonthlyRevenue = computed(() =>
    Math.max(...this.monthlyRevenue().map((m) => m.total), 1),
  );

  readonly maxItemQuantity = computed(() => Math.max(...this.topItems().map((i) => i.quantity), 1));

  ngOnInit(): void {
    this.loadOrders();
  }

  readonly loadOrders = async (): Promise<void> => {
    this.isLoading.set(true);
    const orders = await this.orderService.getAllOrders();
    this.orders.set(orders);
    this.isLoading.set(false);
  };

  readonly buildDonutSegments = () => {
    const circumference = 2 * Math.PI * 40; // r=40
    let offset = 0;

    return this.statusDistribution().map((s) => {
      const dash = (s.percentage / 100) * circumference;
      const segment = {
        ...s,
        dashArray: `${dash} ${circumference - dash}`,
        dashOffset: -offset,
      };
      offset += dash;
      return segment;
    });
  };

  readonly formatCurrency = (value: number): string => {
    return formatCurrency(value);
  };
}
