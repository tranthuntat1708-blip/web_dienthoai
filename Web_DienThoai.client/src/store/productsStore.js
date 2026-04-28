import { create } from 'zustand';

export const useProductsStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await fetch('http://localhost:3000/products');
      const data = await res.json();
      set({ products: data, loading: false });
    } catch (err) {
      console.error('Lỗi load products:', err);
      set({ loading: false });
    }
  }
}));