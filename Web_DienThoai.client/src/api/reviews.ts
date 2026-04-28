import apiClient from "./client";

export const reviewApi = {
  create: (productId, payload) =>
    apiClient.post(`/products/${productId}/reviews`, payload).then((response) => response.data),
};
