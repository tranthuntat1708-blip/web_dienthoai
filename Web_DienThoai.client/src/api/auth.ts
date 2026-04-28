import apiClient from "./client";

export const authApi = {
  // 👉 đăng ký
  register: async (data: any) => {
    const res = await apiClient.post("/users", data);
    return res.data;
  },

  // 👉 đăng nhập giả lập
  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.get("/users", {
      params: {
        email: data.email,
        password: data.password,
      },
    });

    if (res.data.length === 0) {
      throw new Error("Sai email hoặc mật khẩu");
    }

    // giả lập token
    return {
      user: res.data[0],
      token: "fake-token-123",
    };
  },
};
