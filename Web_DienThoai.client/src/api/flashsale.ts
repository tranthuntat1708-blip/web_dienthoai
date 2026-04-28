// src/api/flashsale.ts
import apiClient from './client';

export interface FlashSaleItem {
  productId: number;
  productName: string;
  productSlug: string;
mainImageUrl: string;
  originalPrice: number;
  salePrice: number;
  stockLimit?: number;
  averageRating?: number;
  reviewCount: number;
  soldCount: number;
}

export interface FlashSale {
  id: number;
  name: string;
  startAt: string;
  endAt: string;
  items: FlashSaleItem[];
}

export const flashSaleApi = {
  /** Flash sale đang diễn ra (nếu có). Trả null nếu 404. */
  getActive: () =>
    apiClient
      .get<FlashSale>('/flash-sale/active')
   .then((r) => r.data)
    .catch((err) => {
        if (err?.response?.status === 404) return null;
        throw err;
      }),
};
