import apiClient from "./client";

export const authApi = {
  register: async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },
};
