// ===== PRODUCT TYPES =====

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  sortOrder: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  sortOrder: number;
  productCount: number;
}

// 👉 Dùng cho card
export interface ProductCard {
  id: number;
  name: string;
  slug: string;

  // ⚠️ đổi sang images để khớp db.json
  images: string[];

  price: number;
  salePrice?: number;
  isOnSale: boolean;

  material: string;
  style: string;
  color: string;

  soldCount: number;
  averageRating?: number;
  reviewCount: number;
}

// 👉 Trang chi tiết
export interface ProductDetail extends ProductCard {
  description: string;
  stock: number;

  subImages?: ProductImage[];

  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg?: number;

  category?: Category;
  bundledProducts?: ProductCard[];
  latestReviews?: Review[];
}

export interface Review {
  id: number;
  userName: string;
  userAvatarUrl?: string;
  rating: number;
  comment: string;
  imageUrls: string[];
  adminReply?: string;
  createdAt: string;
}

export interface ProductFilterParams {
  categoryId?: number;
  categorySlug?: string;
  q?: string;
  material?: string;
  style?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "best_seller";
  page?: number;
  pageSize?: number;
}

// 👉 QUAN TRỌNG: khớp với API đã fix
export interface PaginatedProducts {
  items: ProductCard[];
  total: number;
  page: number;
  pageSize: number;
}
