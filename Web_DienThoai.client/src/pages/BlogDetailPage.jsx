import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { blogApi } from "../api/blogs";
import { resolveImage } from "../utils/imageResolver";

function formatBlogDate(createdAt) {
  const d = new Date(createdAt);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function blogTag(type) {
  return type === "Lookbook" ? "LOOKBOOK" : "TIN TỨC";
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    blogApi
      .getBySlug(slug)
      .then((res) => {
        if (!res) {
          setError("Không tìm thấy bài viết.");
          return;
        }
        setBlog(res);
      })
      .catch(() => setError("Không tìm thấy bài viết."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 pb-20 pt-32 text-center">
        Đang tải...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen px-4 pb-20 pt-32 text-center">
        {error || "Không có dữ liệu"}
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "var(--craft-cream)" }}
      className="min-h-screen pb-20 pt-8"
    >
      <div className="mx-auto max-w-4xl px-4">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600"
        >
          <ChevronLeft size={16} /> Quay lại Tin tức
        </Link>

        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">
            {blogTag(blog.type)}
          </span>

          <h1 className="mb-6 text-4xl font-bold text-stone-800 md:text-5xl">
            {blog.title}
          </h1>

          <p className="text-sm text-stone-500">
            Đăng ngày: {formatBlogDate(blog.createdAt)}
          </p>
        </div>

        {blog.coverImageUrl && (
          <div className="mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-xl">
            <img
              src={resolveImage(blog.coverImageUrl, "https://placehold.co/1200x700?text=Blog")}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
