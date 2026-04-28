import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, TicketPercent } from "lucide-react";

import ProductCard from "../components/product/ProductCardProduction";
import FlashSaleCountdown from "../components/common/FlashSaleCountdown";
import { productApi } from "../api/products";
import { blogApi } from "../api/blogs";
import { voucherApi } from "../api/vouchers";
import { homeMerchandisingApi } from "../api/homeMerchandising";
import { defaultHomeMerchandising } from "../utils/homeMerchandising";
import { formatVnd } from "../utils/format";
import { resolveImage } from "../utils/imageResolver";

function SectionHeader({ title, description, cta, to }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      </div>
      {cta && to ? (
        <Link to={to} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePageProduction() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [merchandising, setMerchandising] = useState(defaultHomeMerchandising);

  useEffect(() => {
    const run = async () => {
      try {
        const [productRes, flashRes, blogRes, voucherRes, merchRes] = await Promise.all([
          productApi.getProducts({ pageSize: 12 }),
          productApi.getProducts({ promotion: "flash-sale", pageSize: 6 }),
          blogApi.getAll({ page: 1, pageSize: 3 }),
          voucherApi.getPublic(),
          homeMerchandisingApi.getPublic(),
        ]);

        setProducts(productRes?.data || productRes?.items || []);
        setFlashSale(flashRes?.data || flashRes?.items || []);
        setBlogs(blogRes?.items || []);
        setVouchers(voucherRes ?? []);
        setMerchandising({ ...defaultHomeMerchandising, ...(merchRes || {}) });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 py-8">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-10 pb-10">
      <section className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,_#eff6ff_0%,_#ffffff_50%,_#eef2ff_100%)] px-6 py-10 md:px-10 md:py-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">TechStore</p>
          <h1 className="text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {merchandising.heroTitle || "Mua điện thoại và phụ kiện chính hãng dễ hơn mỗi ngày."}
          </h1>
          <p className="text-sm leading-6 text-slate-600 md:text-base">
            {merchandising.heroDescription || "Một giao diện gọn, rõ và tập trung vào sản phẩm để bạn chọn nhanh hơn."}
          </p>
          <Link
            to="/danh-muc"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Khám phá sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {vouchers.length > 0 ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
            <TicketPercent size={12} />
            Mã giảm giá hôm nay
          </div>
          <div className="flex flex-wrap gap-2">
            {vouchers.slice(0, 4).map((voucher) => (
              <button
                key={voucher.code}
                type="button"
                onClick={() => navigator.clipboard?.writeText(voucher.code)}
                className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {voucher.code} · {voucher.discountPercent}% ·{" "}
                {voucher.maxDiscountAmount ? `Tối đa ${formatVnd(voucher.maxDiscountAmount)}` : "Không giới hạn"}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <SectionHeader
          title="Sản phẩm nổi bật"
          description="Bố cục chuẩn hóa: ảnh rõ, tên gọn, giá nổi bật và CTA nhất quán."
          cta="Xem tất cả"
          to="/danh-muc"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {flashSale.length > 0 ? (
        <section className="space-y-5 rounded-3xl border border-red-100 bg-[linear-gradient(135deg,_#fff7ed_0%,_#ffffff_50%,_#fff1f2_100%)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                <Flame size={12} />
                Flash sale
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">Deal đang chạy</h2>
            </div>
            <FlashSaleCountdown />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashSale.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      {blogs.length > 0 ? (
        <section className="space-y-5">
          <SectionHeader title="Tin tức công nghệ" cta="Xem blog" to="/blog" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={resolveImage(blog.coverImageUrl, "https://picsum.photos/900/600")}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="line-clamp-2 text-base font-bold text-slate-900">{blog.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blog.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

