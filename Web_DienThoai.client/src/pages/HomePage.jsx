// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import FlashSaleCountdown from "../components/common/FlashSaleCountdown";

import { productApi } from "../api/products";
import { blogApi } from "../api/blogs";

/* ================= SKELETON ================= */
function SkeletonHome() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, f, b] = await Promise.all([
          productApi.getProducts({ pageSize: 8 }),
          productApi.getProducts({ promotion: "flash-sale", pageSize: 6 }),
          blogApi.getAll({ page: 1, pageSize: 3 }), // ✅ FIX
        ]);

        setProducts(p?.data || []);
        setFlashSale(f?.data || []);
        setBlogs(b?.items || []); // ✅ FIX QUAN TRỌNG
      } catch (err) {
        console.error("API lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* LOADING */
  if (loading) return <SkeletonHome />;

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-3">Mua sắm công nghệ</h1>
          <p className="text-sm opacity-90 mb-4">
            Giá tốt - Chính hãng - Bảo hành dài
          </p>

          <Link
            to="/danh-muc"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold w-fit"
          >
            Mua ngay <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
          Banner
        </div>
      </section>

      {/* FLASH SALE */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-red-500">
            <Flame /> Flash Sale
          </h2>
          <FlashSaleCountdown />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {flashSale.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sản phẩm nổi bật</h2>
          <Link to="/danh-muc" className="text-blue-500 text-sm">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* MINI BANNER */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-yellow-100 p-5 rounded-xl">
          ⚡ Ưu đãi sốc mỗi ngày
        </div>
        <div className="bg-green-100 p-5 rounded-xl">🚚 Freeship toàn quốc</div>
        <div className="bg-blue-100 p-5 rounded-xl">💳 Trả góp 0%</div>
      </section>

      {/* BLOG */}
      <section>
        <h2 className="text-xl font-bold mb-4">Tin công nghệ</h2>

        <div className="grid md:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={blog.coverImageUrl || "https://picsum.photos/400/300"}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
