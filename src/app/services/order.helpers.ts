import { DraftOrderItem, NewOrder, NewOrderItem, Order, OrderItem, OrderStatus } from '../types/order.type';

type OrderItemRow = {
  id: string;
  order_id: string;
  description: string;
  price: number;
  quantity: number;
  observations: string | null;
  is_checked: boolean | null;
};

type OrderRow = {
  id: string;
  client_name: string;
  deadline: string;
  status: string;
  created_at: string;
  amount_paid: number;
  order_items: OrderItemRow[];
};

export const mapOrderItemRowToOrderItem = (row: OrderItemRow): OrderItem => {
  const item: OrderItem = {
    id: row.id,
    orderId: row.order_id,
    description: row.description,
    price: row.price,
    quantity: row.quantity,
    observations: row.observations,
    isChecked: row.is_checked ?? false,
  };

  return item;
};

export const mapOrderRowToOrder = (row: OrderRow): Order => {
  const items = (row.order_items ?? []).map(mapOrderItemRowToOrderItem);
  const order: Order = {
    id: row.id,
    clientName: row.client_name,
    deadline: row.deadline,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
    amountPaid: row.amount_paid,
    items,
  };

  return order;
};

export const mapNewOrderToOrderRow = (newOrder: NewOrder) => {
  const row = {
    client_name: newOrder.clientName,
    deadline: newOrder.deadline,
    amount_paid: 0,
  };

  return row;
};

export const mapNewOrderItemToOrderItemRow = (item: NewOrderItem, orderId: string) => {
  const row = {
    order_id: orderId,
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    observations: item.observations,
  };

  return row;
};

export const mapItemToNewOrderItem = (item: DraftOrderItem): NewOrderItem => {
  const newOrderItem: NewOrderItem = {
    description: item.description,
    price: item.price,
    quantity: item.quantity,
    observations: item.observations,
  };

  return newOrderItem;
};