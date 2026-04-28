import { create } from "zustand";
import { persist } from "zustand/middleware";

function toRecentItem(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    mainImageUrl: product.mainImageUrl,
    price: product.promotionalPrice ?? product.salePrice ?? product.price,
    originalPrice: product.price,
    rating: product.averageRating ?? product.rating ?? 0,
    reviews: product.reviewCount ?? product.reviews ?? 0,
    brand: product.brand,
    storage: product.storage,
    viewedAt: new Date().toISOString(),
  };
}

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],
      track: (product) => {
        const nextItem = toRecentItem(product);
        const items = get().items.filter((item) => item.id !== product.id);
        set({ items: [nextItem, ...items].slice(0, 12) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed-storage",
    },
  ),
);
