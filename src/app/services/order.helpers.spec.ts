import { describe, expect, it } from 'vitest';
import {
  mapItemToNewOrderItem,
  mapNewOrderItemToOrderItemRow,
  mapNewOrderToOrderRow,
  mapOrderRowToOrder,
} from './order.helpers';

describe('mapOrderRowToOrder', () => {
  it('maps a row with items to the Order domain type', () => {
    const row = {
      id: '1',
      client_name: 'Maria',
      deadline: '2026-07-01',
      status: 'pending',
      created_at: '2026-06-01T00:00:00Z',
      amount_paid: 0,
      order_items: [
        {
          id: 'i1',
          order_id: '1',
          description: 'Suporte',
          price: 10,
          quantity: 2,
          observations: null,
          is_checked: false,
        },
      ],
    };

    const order = mapOrderRowToOrder(row);

    expect(order.clientName).toBe('Maria');
    expect(order.items.length).toBe(1);
    expect(order.items[0].description).toBe('Suporte');
  });

  it('returns an empty items array when order_items is missing', () => {
    const row = {
      id: '1',
      client_name: 'Maria',
      deadline: '2026-07-01',
      status: 'pending',
      created_at: '2026-06-01T00:00:00Z',
      amount_paid: 0,
      order_items: undefined as any,
    };

    const order = mapOrderRowToOrder(row);

    expect(order.items).toEqual([]);
  });
});

describe('mapNewOrderToOrderRow', () => {
  it('converts camelCase fields to snake_case', () => {
    const row = mapNewOrderToOrderRow({ clientName: 'João', deadline: '2026-08-01', items: [] });

    expect(row.client_name).toBe('João');
    expect(row.deadline).toBe('2026-08-01');
  });
});

describe('mapNewOrderItemToOrderItemRow', () => {
  it('attaches the orderId to the item row', () => {
    const row = mapNewOrderItemToOrderItemRow(
      { description: 'Caixa', price: 5, quantity: 3, observations: '' },
      'order-1',
    );

    expect(row.order_id).toBe('order-1');
    expect(row.quantity).toBe(3);
  });
});

describe('mapItemToNewOrderItem', () => {
  it('strips the id and keeps only the fields the backend needs', () => {
    const item = {
      id: '1',
      description: 'Suporte',
      price: 10,
      quantity: 2,
      observations: 'Cor azul',
    };
    const newOrderItem = mapItemToNewOrderItem(item as any);

    expect(newOrderItem).toEqual({
      description: 'Suporte',
      price: 10,
      quantity: 2,
      observations: 'Cor azul',
    });
  });
});
