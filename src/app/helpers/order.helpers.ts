import { DraftOrderItem, Order, OrderStatus, PaymentStatus } from '../types/order.type';

export type StatusColumnConfig = {
  status: OrderStatus;
  label: string;
};

export const STATUS_COLUMNS: StatusColumnConfig[] = [
  { status: 'pending', label: 'Pendente' },
  { status: 'processing', label: 'Em andamento' },
  { status: 'completed', label: 'Concluído' },
  { status: 'delivered', label: 'Entregue' },
  { status: 'cancelled', label: 'Cancelado' },
];

export const formatOrderStatus = (status: OrderStatus): string => {
  const column = STATUS_COLUMNS.find((statusColumn) => statusColumn.status === status);
  const label = column ? column.label : status;

  return label;
};

export const calculateItemSubtotal = (item: DraftOrderItem): number => {
  const subtotal = item.price * item.quantity;

  return subtotal;
};

export const calculateTotalPrice = (items: DraftOrderItem[]): number => {
  const total = items.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);

  return total;
};

export const calculateTotalQuantity = (items: DraftOrderItem[]): number => {
  const total = items.reduce((acc, item) => acc + item.quantity, 0);

  return total;
};

export const createOrderItem = (
  description: string,
  price: number,
  quantity: number,
  observations: string | null,
): DraftOrderItem => {
  const item: DraftOrderItem = {
    id: crypto.randomUUID(),
    description,
    price,
    quantity,
    observations,
  };

  return item;
};

export const isFormValid = (description: string, price: number, quantity: number): boolean => {
  const valid = description.trim().length > 0 && price > 0 && quantity > 0;

  return valid;
};

export const isOrderValid = (
  clientName: string,
  deadline: string,
  items: DraftOrderItem[],
): boolean => {
  const valid = clientName.trim().length > 0 && deadline.length > 0 && items.length > 0;

  console.log('isOrderValid', { clientName, deadline, items, valid });
  return valid;
};

export const createEmptyColumns = (): Record<OrderStatus, Order[]> => {
  const columns = STATUS_COLUMNS.reduce(
    (accumulated, column) => ({ ...accumulated, [column.status]: [] }),
    {} as Record<OrderStatus, Order[]>,
  );

  return columns;
};

export const groupOrdersByStatus = (orders: Order[]): Record<OrderStatus, Order[]> => {
  const grouped = STATUS_COLUMNS.reduce(
    (accumulated, column) => {
      const ordersForStatus = orders.filter((order) => order.status === column.status);
      const updated = { ...accumulated, [column.status]: ordersForStatus };

      return updated;
    },
    {} as Record<OrderStatus, Order[]>,
  );

  return grouped;
};

export const calculateColumnTotal = (orders: Order[]): number => {
  const total = orders.reduce(
    (accumulated, order) => accumulated + calculateTotalPrice(order.items),
    0,
  );

  return total;
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const formatted = date.toLocaleDateString('pt-BR');

  return formatted;
};

export const formatCurrency = (value: number): string => {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return formatted;
};

export const getPaymentStatus = (amountPaid: number, total: number): PaymentStatus => {
  if (amountPaid <= 0) return 'unpaid';
  if (amountPaid >= total) return 'paid';
  return 'partial';
};