export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export type OrderItem = {
  id: string;
  orderId: string;
  description: string;
  price: number;
  quantity: number;
  observations: string | null;
};

export type Order = {
  id: string;
  clientName: string;
  deadline: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
};

export type NewOrderItem = {
  description: string;
  price: number;
  quantity: number;
  observations: string | null;
};

export type NewOrder = {
  clientName: string;
  deadline: string;
  items: NewOrderItem[];
};

export type DraftOrderItem = {
  id: string;
  description: string;
  price: number;
  quantity: number;
  observations: string | null;
};