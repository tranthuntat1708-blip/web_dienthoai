// src/pages/CollectionPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/products";
import ProductCard from "../components/product/ProductCard";
import { resolveImage } from "../utils/imageResolver";

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅ OK khi nằm trong function async

        const res = await productApi.getProducts();
        const data = Array.isArray(res) ? res : res.items || [];

        setProducts(data);
        setTotal(res.total || data.length);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const setPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HERO */}
      <div className="relative w-full h-72 md:h-[400px] flex items-center justify-center overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Sản phẩm nổi bật 🔥
          </h1>
          <p className="text-gray-300">
            Điện thoại, tai nghe và phụ kiện công nghệ mới nhất
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Tất Cả Sản Phẩm ({total})
          </h2>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-60 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Không có sản phẩm nào.
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products?.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    ...p,
                    mainImageUrl:
                      resolveImage?.(p.mainImageUrl) || p.mainImageUrl,
                  }}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {total > 12 && (
              <div className="mt-10 flex justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded"
                >
                  Trang trước
                </button>

                <button
                  disabled={page * 12 >= total}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded"
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
