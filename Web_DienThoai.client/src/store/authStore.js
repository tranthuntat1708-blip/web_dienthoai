import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // ✅ LOGIN
      login: (authResponse) => {
        // hỗ trợ nhiều format API
        const token = authResponse?.token || authResponse?.data?.token;

        const userData = authResponse?.user ||
          authResponse?.data?.user || {
            userId: authResponse.userId,
            fullName: authResponse.fullName,
            email: authResponse.email,
            role: authResponse.role,
          };

        if (token) {
          localStorage.setItem("auth_token", token);
        }

        set({
          token,
          user: {
            userId: userData?.id || userData?.userId,
            fullName: userData?.fullName,
            email: userData?.email,
            role: String(userData?.role || "User").trim().toLowerCase() === "admin" ? "Admin" : "User",
          },
        });
      },

      // ✅ LOGOUT
      logout: () => {
        localStorage.removeItem("auth_token");
        set({ token: null, user: null });
      },

      // ✅ GETTER (đúng chuẩn)
      isAdmin: () => {
        return String(get().user?.role || "").trim().toLowerCase() === "admin";
      },
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    {
      name: "auth-storage", // đổi tên cho sạch
    },
  ),
);
