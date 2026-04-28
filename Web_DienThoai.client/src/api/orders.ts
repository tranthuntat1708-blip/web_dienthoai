// src/api/orders.ts
import apiClient from './client';
import type { CreateOrderPayload, OrderDetail, OrderSummary } from '../types/order';

export const orderApi = {
  createOrder: (payload: CreateOrderPayload) =>
    apiClient
  .post<{ orderSummary: OrderSummary; paymentUrl?: string }>('/orders', payload)
      .then((r) => r.data),

  getMyOrders: () =>
    apiClient.get<OrderSummary[]>('/orders/my').then((r) => r.data),

  getOrder: (id: number) =>
    apiClient.get<OrderDetail>(`/orders/${id}`).then((r) => r.data),

  lookupGuestOrder: (orderCode: string, phone: string) =>
    apiClient
      .get<OrderDetail>("/orders/lookup", {
        params: { orderCode, phone },
      })
      .then((r) => r.data),

  validateVoucher: (code: string, orderAmount: number) =>
    apiClient
  .post<{ isValid: boolean; discountAmount: number; message?: string }>(
  '/vouchers/validate',
        { code, orderAmount }
   )
      .then((r) => r.data),

  // Admin
  getAllOrders: (page = 1, pageSize = 20, status?: string) =>
 apiClient
      .get<{ total: number; page: number; items: any[] }>('/orders', {
        params: { page, pageSize, status },
 })
      .then((r) => r.data),

  updateStatus: (id: number, status: string) =>
    apiClient.put(`/orders/${id}/status`, { status }).then((r) => r.data),
};
