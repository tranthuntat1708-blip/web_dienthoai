import apiClient from "./client";
import { getMappedBlogImage } from "../utils/blogImageMap";

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  type: "Blog" | "Lookbook";
  createdAt: string;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
}

export interface PaginatedBlogPosts {
  total: number;
  page: number;
  pageSize: number;
  items: BlogPostSummary[];
}

function normalizeBlog<T extends BlogPostSummary | BlogPostDetail>(post: T): T {
  return {
    ...post,
    coverImageUrl: getMappedBlogImage(post.slug, post.coverImageUrl),
  };
}

export const blogApi = {
  getAll: async (params?: {
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedBlogPosts> => {
    try {
      const res = await apiClient.get<PaginatedBlogPosts>("/blog", { params });
      const data = res.data;
      return {
        ...data,
        items: (data.items ?? []).map(normalizeBlog),
      };
    } catch (error: any) {
      console.error("Lỗi getAll blog:", error);
      return {
        total: 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        items: [],
      };
    }
  },

  getBySlug: async (slug: string): Promise<BlogPostDetail | null> => {
    try {
      const res = await apiClient.get<BlogPostDetail>(`/blog/${slug}`);
      return normalizeBlog(res.data);
    } catch (error: any) {
      console.error("Lỗi getBySlug:", error);
      return null;
    }
  },

  getFeatured: async (limit = 3): Promise<BlogPostSummary[]> => {
    try {
      const res = await apiClient.get<PaginatedBlogPosts>("/blog", {
        params: { page: 1, pageSize: limit },
      });
      return (res.data.items ?? []).map(normalizeBlog);
    } catch (error) {
      console.error("Lỗi getFeatured:", error);
      return [];
    }
  },

  search: async (keyword: string): Promise<BlogPostSummary[]> => {
    try {
      const res = await apiClient.get<PaginatedBlogPosts>("/blog", {
        params: { q: keyword },
      });
      return (res.data.items ?? []).map(normalizeBlog);
    } catch (error) {
      console.error("Lỗi search blog:", error);
      return [];
    }
  },
};
