// src/types/order.ts

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipping'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export type OrderType = 'Retail' | 'DesignDeposit';
export type PaymentMethod = 'VNPay' | 'QR' | 'COD';

export interface CartItem {
  productId: number;
  productName: string;
  mainImageUrl: string;
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderPayload {
  type: OrderType;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  paymentMethod: 'vnpay' | 'qr' | 'cod';
  voucherCode?: string;
  items: CartItem[];
}

export interface OrderSummary {
  id: number;
  orderCode: string;
  status: OrderStatus;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  totalAmount: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  vnpayTransactionId?: string;
  items: CartItem[];
}
