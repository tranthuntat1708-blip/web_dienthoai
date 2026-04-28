// src/api/vouchers.ts
import apiClient from './client';

export interface PublicVoucher {
  code: string;
  discountPercent: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  expiresAt?: string;
}

export interface VoucherValidationResult {
  isValid: boolean;
  discountAmount: number;
  message?: string;
}

export const voucherApi = {
  /** Danh sách voucher công khai đang hoạt động */
  getPublic: () =>
    apiClient.get<PublicVoucher[]>('/vouchers').then((r) => r.data),

  /** Kiểm tra & tính giảm giá cho một voucher */
validate: (code: string, orderAmount: number) =>
    apiClient
      .post<VoucherValidationResult>('/vouchers/validate', { code, orderAmount })
   .then((r) => r.data),
};
