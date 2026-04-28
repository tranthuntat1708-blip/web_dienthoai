import axios from "axios";

// 👉 tạo instance riêng (fix lỗi /api)
const api = axios.create({
  baseURL: "http://localhost:3000", // ❗ bỏ /api
});

// 👉 kiểu dữ liệu category
export interface Category {
  id: number;
  name: string;
}

// 👉 API category
export const categoryApi = {
  // ✅ lấy tất cả category
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi lấy categories:", error);
      throw error;
    }
  },

  // ✅ lấy theo id
  getById: async (id: number): Promise<Category> => {
    try {
      const res = await api.get(`/categories/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi lấy category:", error);
      throw error;
    }
  },

  // ✅ tạo mới
  create: async (data: { name: string }): Promise<Category> => {
    try {
      const res = await api.post("/categories", data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi tạo category:", error);
      throw error;
    }
  },

  // ✅ xoá
  remove: async (id: number): Promise<void> => {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      console.error("❌ Lỗi xoá category:", error);
      throw error;
    }
  },
};
