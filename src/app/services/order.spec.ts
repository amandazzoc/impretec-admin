import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from './order.service';
import { supabase } from './supabase.client';

vi.mock('./supabase.client', () => ({
  supabase: { from: vi.fn() },
}));

describe('Order service', () => {
  const orderService = new OrderService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteOrder', () => {
    it('returns true when the deletion succeeds', async () => {
      const eq = vi.fn().mockResolvedValue({ error: null });
      const del = vi.fn().mockReturnValue({ eq });
      vi.mocked(supabase.from).mockReturnValue({ delete: del } as any);

      const success = await orderService.deleteOrder('order-1');

      expect(success).toBe(true);
    });

    it('returns false when the deletion fails', async () => {
      const eq = vi.fn().mockResolvedValue({ error: { message: 'fail' } });
      const del = vi.fn().mockReturnValue({ eq });
      vi.mocked(supabase.from).mockReturnValue({ delete: del } as any);

      const success = await orderService.deleteOrder('order-1');

      expect(success).toBe(false);
    });
  });
});
