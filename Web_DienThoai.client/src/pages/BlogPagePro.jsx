import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpenText } from "lucide-react";

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

export default function BlogPagePro() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await blogApi.getAll({ page, pageSize: 9 });
        if (!isMounted) return;
        setBlogs(res?.items || []);
        setTotal(res?.total || 0);
      } catch (err) {
        if (isMounted) {
          setBlogs([]);
          setTotal(0);
        }
        console.error("Lỗi load blog:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fbff_0%,_#ffffff_45%,_#eef4ff_100%)] pb-16">
      <section className="relative overflow-hidden border-b border-slate-200 py-14">
        <img
          src="https://images.unsplash.com/photo-1510557880182-3c5a9a5c5c03?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 h-full w-full object-cover"
          alt="Tin tức công nghệ"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-blue-900/70" />
        <div className="relative mx-auto max-w-7xl px-4 text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            <BookOpenText size={12} />
            Tin tức
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Góc tin tức công nghệ từ TechStore
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
            Cập nhật xu hướng sản phẩm mới, kinh nghiệm chọn máy và các bài đánh giá
            ngắn gọn, dễ đọc.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-video rounded-xl" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center text-slate-500">
            Chưa có bài viết nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={resolveImage(post.coverImageUrl, "https://placehold.co/600x400?text=Blog")}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {blogTag(post.type)}
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="mb-1 text-xs text-slate-400">{formatBlogDate(post.createdAt)}</p>
                    <h3 className="mb-2 line-clamp-2 font-bold text-slate-900 transition group-hover:text-blue-600">
                      {post.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>

            {total > 9 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 disabled:opacity-50"
                >
                  Trang trước
                </button>

                <span className="text-sm text-slate-500">Trang {page}</span>

                <button
                  disabled={page * 9 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
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
