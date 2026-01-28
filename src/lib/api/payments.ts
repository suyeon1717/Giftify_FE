import { apiClient } from './client';
import type {
  Payment,
  PaymentCreateRequest,
  PaymentResult
} from '@/types/payment';

export async function createPayment(data: PaymentCreateRequest): Promise<PaymentResult> {
  return apiClient.post<PaymentResult>('/api/payments', data);
}

export async function getPayment(paymentId: string): Promise<Payment> {
  return apiClient.get<Payment>(`/api/payments/${paymentId}`);
}
