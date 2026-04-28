import { create } from "zustand";
import { persist } from "zustand/middleware";

function toCompareItem(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    mainImageUrl: product.mainImageUrl,
    price: product.promotionalPrice ?? product.salePrice ?? product.price,
    originalPrice: product.price,
    brand: product.brand,
    ram: product.ram,
    storage: product.storage,
    screen: product.screen,
    camera: product.camera,
    battery: product.battery,
    chip: product.chip,
    charging: product.charging,
    connectivity: product.connectivity,
    color: product.color,
    stock: product.stock,
  };
}

export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const current = get().items;
        const exists = current.some((item) => item.id === product.id);

        if (exists) {
          set({ items: current.filter((item) => item.id !== product.id) });
          return { added: false, message: "Đã bỏ khỏi danh sách so sánh." };
        }

        if (current.length >= 4) {
          return { added: false, blocked: true, message: "Bạn chỉ có thể so sánh tối đa 4 sản phẩm." };
        }

        set({ items: [...current, toCompareItem(product)] });
        return { added: true, message: "Đã thêm vào danh sách so sánh." };
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "compare-storage",
    },
  ),
);
