import { useEffect, useMemo, useState } from "react";
import { Sparkles, Star } from "lucide-react";

import { productApi } from "../api/products";
import ProductCard from "../components/product/ProductCard";
import { resolveImage } from "../utils/imageResolver";

const PAGE_SIZE = 12;

export default function CollectionPagePro() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await productApi.getProducts({ page: 1, pageSize: 200 });
        const data = Array.isArray(res) ? res : res.items || [];
        if (!cancelled) setProducts(data);
      } catch (error) {
        if (!cancelled) setProducts([]);
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fbff_0%,_#ffffff_45%,_#eef4ff_100%)] pb-16">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 py-14 text-white">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80"
          alt="Bộ sưu tập nổi bật"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/70" />
        <div className="relative mx-auto max-w-7xl px-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            <Sparkles size={12} />
            Bộ sưu tập nổi bật
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight md:text-5xl">
            Điểm danh sản phẩm công nghệ đang được quan tâm nhiều nhất.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Danh sách được cập nhật từ dữ liệu thật để bạn xem nhanh các mẫu điện thoại,
            tablet và phụ kiện đáng chú ý trong tuần.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Nổi bật
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Tất cả sản phẩm ({total})
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            <Star size={13} />
            Cập nhật tự động theo tồn kho
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : pagedProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center text-slate-500">
            Chưa có sản phẩm nổi bật.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {pagedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    mainImageUrl: resolveImage(product.mainImageUrl),
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                      p === page
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
