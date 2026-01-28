import { apiClient } from './client';
import type { PageParams } from '@/types/api';
import type {
  Order,
  OrderItem,
  OrderDetail,
  OrderCreateRequest,
  OrderListResponse
} from '@/types/order';

export async function createOrder(data?: OrderCreateRequest): Promise<Order> {
  return apiClient.post<Order>('/api/orders', data || {});
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  return apiClient.get<OrderDetail>(`/api/orders/${orderId}`);
}

export async function getOrders(params?: PageParams): Promise<OrderListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/orders?${queryString}` : '/api/orders';

  return apiClient.get<OrderListResponse>(endpoint);
}
