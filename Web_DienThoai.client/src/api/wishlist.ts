// src/api/wishlist.ts
import apiClient from './client';

export interface WishlistItemDto {
    id: number;
    productId: number;
    productName: string;
    slug: string;
    mainImageUrl: string | null;
    price: number;
    salePrice: number | null;
    isOnSale: boolean;
    stock: number;
    categoryName: string | null;
    addedAt: string;
}

export const wishlistApi = {
    /** Lấy danh sách yêu thích đầy đủ (có thông tin sản phẩm) */
    getWishlist: () =>
        apiClient.get<WishlistItemDto[]>('/wishlist').then((r) => r.data),

    /** Lấy danh sách productId đã yêu thích (dùng check nhanh trên UI) */
    getWishlistIds: () =>
        apiClient.get<number[]>('/wishlist/ids').then((r) => r.data),

    /** Thêm sản phẩm vào yêu thích */
    add: (productId: number) =>
        apiClient.post<{ message: string; id?: number; alreadyExists?: boolean }>(
            `/wishlist/${productId}`
        ).then((r) => r.data),

    /** Xóa sản phẩm khỏi yêu thích */
    remove: (productId: number) =>
        apiClient.delete<{ message: string }>(`/wishlist/${productId}`).then((r) => r.data),

    /** Toggle yêu thích (thêm nếu chưa có, xóa nếu đã có) */
    toggle: (productId: number) =>
        apiClient.post<{ isInWishlist: boolean; message: string }>(
            `/wishlist/toggle/${productId}`
        ).then((r) => r.data),

    /** Kiểm tra sản phẩm đã có trong wishlist chưa */
    check: (productId: number) =>
        apiClient.get<{ isInWishlist: boolean }>(`/wishlist/check/${productId}`).then((r) => r.data),
};
