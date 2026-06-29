import { DraftOrderItem } from '../types/order.type';
import {
  calculateItemSubtotal,
  calculateTotalPrice,
  calculateTotalQuantity,
  createOrderItem,
  isFormValid,
  isOrderValid,
  groupOrdersByStatus,
  calculateColumnTotal,
  formatDate,
  formatCurrency,
} from './order.helpers';

const buildItem = (overrides: Partial<DraftOrderItem> = {}): DraftOrderItem => {
  const item: DraftOrderItem = {
    id: '1',
    description: 'Item 1',
    price: 10,
    quantity: 2,
    observations: 'Observations',
    ...overrides,
  };

  return item;
};

describe('calculateItemSubtotal', () => {
  it('multiplies price by quantity', () => {
    const item = buildItem({ price: 10, quantity: 2 });
    const subtotal = calculateItemSubtotal(item);

    expect(subtotal).toBe(20);
  });
});

describe('calculateTotalPrice', () => {
  it('sums up the subtotals of all items', () => {
    const itens = [buildItem({ price: 10, quantity: 2 }), buildItem({ price: 5, quantity: 4 })];
    const total = calculateTotalPrice(itens);

    expect(total).toBe(40);
  });

  it('returns 0 when there are no items', () => {
    const total = calculateTotalPrice([]);

    expect(total).toBe(0);
  });
});

describe('calculateTotalQuantity', () => {
  it('sums the quantities of all items', () => {
    const items = [buildItem({ quantity: 2 }), buildItem({ quantity: 3 })];
    const total = calculateTotalQuantity(items);

    expect(total).toBe(5);
  });
});

describe('createOrderItem', () => {
  it('creates an item with the provided fields and a generated id', () => {
    const item = createOrderItem('Suporte', 20, 2, 'Cor azul');

    expect(item.description).toBe('Suporte');
    expect(item.price).toBe(20);
    expect(item.id.length).toBeGreaterThan(0);
  });
});

describe('isFormValid', () => {
  it('returns true when all fields are valid', () => {
    const valido = isFormValid('Suporte', 10, 1);

    expect(valido).toBe(true);
  });

  it('returns false when description is empty', () => {
    const valido = isFormValid('', 10, 1);

    expect(valido).toBe(false);
  });
});

describe('isOrderValid', () => {
  it('returns true when client, deadline and items are present', () => {
    const items = [buildItem({})];
    const valido = isOrderValid('Maria', '2026-07-01', items);

    expect(valido).toBe(true);
  });

  it('returns false when there are no items', () => {
    const valido = isOrderValid('Maria', '2026-07-01', []);

    expect(valido).toBe(false);
  });
});

describe('formatCurrency', () => {
  it('formats a number as BRL currency', () => {
    const formatted = formatCurrency(96.52);

    expect(formatted).toContain('96,52');
  });
});

describe('groupOrdersByStatus', () => {
  it('groups orders into their matching status columns', () => {
    const orders = [
      {
        id: '1',
        clientName: 'A',
        deadline: '2026-07-01',
        status: 'pending',
        createdAt: '',
        items: [],
      },
      {
        id: '2',
        clientName: 'B',
        deadline: '2026-07-02',
        status: 'completed',
        createdAt: '',
        items: [],
      },
    ] as any;

    const grouped = groupOrdersByStatus(orders);

    expect(grouped.pending.length).toBe(1);
    expect(grouped.completed.length).toBe(1);
    expect(grouped.processing.length).toBe(0);
  });
});

describe('calculateColumnTotal', () => {
  it('sums the total price of every order in the column', () => {
    const orders = [
      { items: [{ price: 10, quantity: 2 }] },
      { items: [{ price: 5, quantity: 1 }] },
    ] as any;

    const total = calculateColumnTotal(orders);

    expect(total).toBe(25);
  });
});

describe('formatDate', () => {
  it('formats an ISO date string as pt-BR', () => {
    const formatted = formatDate('2026-07-01');

    expect(formatted).toContain('2026');
  });
});