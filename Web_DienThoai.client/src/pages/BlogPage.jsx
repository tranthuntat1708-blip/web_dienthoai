import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const res = await blogApi.getAll({
          page,
          pageSize: 9,
        });

        if (!isMounted) return;

        setBlogs(res?.items || []);
        setTotal(res?.total || 0);
      } catch (err) {
        console.error("Lỗi load blog:", err);
        if (isMounted) {
          setBlogs([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="relative flex h-64 items-center justify-center overflow-hidden md:h-80">
        <img
          src="https://images.unsplash.com/photo-1510557880182-3c5a9a5c5c03?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 h-full w-full object-cover"
          alt="Tin tức công nghệ"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50" />

        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="text-3xl font-bold md:text-4xl">Tin tức công nghệ</h1>
          <p className="mt-2 text-sm text-blue-100">
            Cập nhật xu hướng điện thoại mới nhất
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-video rounded-xl" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            Chưa có bài viết nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={resolveImage(post.coverImageUrl, "https://placehold.co/600x400?text=Blog")}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                      {blogTag(post.type)}
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="mb-1 text-xs text-gray-400">
                      {formatBlogDate(post.createdAt)}
                    </p>

                    <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition group-hover:text-blue-600">
                      {post.title}
                    </h3>

                    <p className="line-clamp-3 text-sm text-gray-500">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {total > 9 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
                >
                  Trang trước
                </button>

                <span className="text-sm text-gray-500">Trang {page}</span>

                <button
                  disabled={page * 9 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
