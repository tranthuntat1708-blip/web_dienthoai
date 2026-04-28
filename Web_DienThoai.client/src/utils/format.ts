// src/utils/format.ts

/** Định dạng tiền VNĐ: 1500000 → "1.500.000 ₫" */
export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Định dạng ngày: "2024-01-15" → "15/01/2024" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN');
}
