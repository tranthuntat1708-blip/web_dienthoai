import apiClient from "./client";
import { defaultHomeMerchandising } from "../utils/homeMerchandising";

export const homeMerchandisingApi = {
  getPublic: async () => {
    try {
      const response = await apiClient.get("/home-merchandising");
      return response.data ?? defaultHomeMerchandising;
    } catch {
      return defaultHomeMerchandising;
    }
  },

  getAdmin: () =>
    apiClient.get("/home-merchandising/admin").then((response) => response.data),

  saveDraft: (payload) =>
    apiClient.put("/home-merchandising/admin/draft", payload).then((response) => response.data),

  publish: (versionId?: number) =>
    apiClient
      .post("/home-merchandising/admin/publish", { versionId: versionId ?? null })
      .then((response) => response.data),
};
