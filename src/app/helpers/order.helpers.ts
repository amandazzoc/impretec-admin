import { OrderItem } from "../types/order.type";

export const calculateItemSubtotal = (item: OrderItem): number => {
    const subtotal = item.price * item.quantity;

    return subtotal;
  }

export const calculateTotalPrice = (items: OrderItem[]): number => {
    const total = items.reduce((acc, item) => acc + calculateItemSubtotal(item), 0);

    return total;
  }

export const calculateTotalQuantity = (items: OrderItem[]): number => {
    const total = items.reduce((acc, item) => acc + item.quantity, 0);

    return total;
  }

export const createOrderItem = (
  description: string,
  price: number,
  quantity: number,
  observations?: string,
): OrderItem => {
  const item: OrderItem = {
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
  }

export const isOrderValid = (clientName: string, deadline: string, items: OrderItem[]): boolean => {
    const valid = clientName.trim().length > 0 && deadline.length > 0 && items.length > 0;

    console.log('isOrderValid', { clientName, deadline, items, valid });
    return valid;
  }

export const formatCurrency = (value: number): string => {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    return formattedValue;
  }