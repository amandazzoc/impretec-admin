import { Injectable } from '@angular/core';
import { NewOrder, Order as OrderModel, OrderStatus } from '../types/order.type';
import { supabase } from './supabase.client';
import { mapNewOrderItemToOrderItemRow, mapNewOrderToOrderRow, mapOrderRowToOrder } from './order.helpers';

const ORDERS_TABLE = 'orders';
const ORDER_ITEMS_TABLE = 'order_items';
const SELECT_WITH_ITEMS = "*, order_items(*)";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  readonly getOrders = async (): Promise<OrderModel[]> => {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select(SELECT_WITH_ITEMS)
      .order('created_at', { ascending: false });

    const orders = error ? [] : data.map(mapOrderRowToOrder);

    return orders;
  };

  readonly getOrderById = async (id: string): Promise<OrderModel | null> => {
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .select(SELECT_WITH_ITEMS)
      .eq('id', id)
      .single();

    const order = error ? null : mapOrderRowToOrder(data);

    return order;
  };

  readonly createOrder = async (newOrder: NewOrder): Promise<OrderModel | null> => {
    const orderRow = mapNewOrderToOrderRow(newOrder);

    const { data: createdOrder, error: orderError } = await supabase
      .from(ORDERS_TABLE)
      .insert(orderRow)
      .select()
      .single();

    const itemRows = orderError
      ? []
      : newOrder.items.map((item) => mapNewOrderItemToOrderItemRow(item, createdOrder.id));

    const { error: itemsError } = await supabase.from(ORDER_ITEMS_TABLE).insert(itemRows);

    const order = orderError || itemsError ? null : await this.getOrderById(createdOrder.id);

    return order;
  };

  readonly updateOrder = async (id: string, updatedOrder: NewOrder): Promise<OrderModel | null> => {
    const orderRow = mapNewOrderToOrderRow(updatedOrder);

    const { error: orderError } = await supabase.from(ORDERS_TABLE).update(orderRow).eq('id', id);
    const { error: deleteError } = await supabase
      .from(ORDER_ITEMS_TABLE)
      .delete()
      .eq('order_id', id);

    const itemRows = updatedOrder.items.map((item) => mapNewOrderItemToOrderItemRow(item, id));
    const { error: insertError } = await supabase.from(ORDER_ITEMS_TABLE).insert(itemRows);

    const order = orderError || deleteError || insertError ? null : await this.getOrderById(id);

    return order;
  };

  readonly deleteOrder = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from(ORDERS_TABLE).delete().eq('id', id);
    const success = !error;

    return success;
  };

  readonly updateOrderStatus = async (
    id: string,
    status: OrderStatus,
  ): Promise<OrderModel | null> => {
    const { error } = await supabase.from(ORDERS_TABLE).update({ status }).eq('id', id);
    const order = error ? null : await this.getOrderById(id);

    return order;
  };
}
