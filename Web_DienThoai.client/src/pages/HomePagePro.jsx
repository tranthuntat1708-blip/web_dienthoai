import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  Flame,
  Gift,
  Headphones,
  ShieldCheck,
  Smartphone,
  Star,
  TicketPercent,
  Truck,
  Zap,
} from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import FlashSaleCountdown from "../components/common/FlashSaleCountdown";
import { productApi } from "../api/products";
import { blogApi } from "../api/blogs";
import { voucherApi } from "../api/vouchers";
import { homeMerchandisingApi } from "../api/homeMerchandising";
import { formatVnd } from "../utils/format";
import { resolveImage } from "../utils/imageResolver";
import { defaultHomeMerchandising } from "../utils/homeMerchandising";

const trustHighlights = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    description: "Bảo hành rõ ràng, đổi trả minh bạch và xuất xứ minh định.",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    description: "Xử lý đơn gọn, theo dõi trạng thái và nhận hàng dễ dàng.",
  },
  {
    icon: Headphones,
    title: "Tư vấn đúng nhu cầu",
    description: "Tập trung vào nhu cầu thật, không đẩy bạn cấu hình dư thừa.",
  },
  {
    icon: BadgePercent,
    title: "Giá và ưu đãi rõ ràng",
    description: "Flash sale, voucher và trả góp hiển thị gọn và dễ so sánh.",
  },
];

function formatBlogDate(createdAt) {
  if (!createdAt) return "Mới cập nhật";

  const date = new Date(createdAt);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getSpecChips(product) {
  if (!product) return [];

  if (product.featureBadges?.length) {
    return product.featureBadges.slice(0, 5);
  }

  return [
    product.brand && `Hãng ${product.brand}`,
    product.ram && `RAM ${product.ram}`,
    product.storage && `Bộ nhớ ${product.storage}`,
    product.camera && `Camera ${product.camera}`,
    product.battery && `Pin ${product.battery}`,
    product.screen && `Màn ${product.screen}`,
    product.color && `Màu ${product.color}`,
    Number.isFinite(product.stock) ? `Còn ${product.stock} máy` : null,
  ].filter(Boolean).slice(0, 5);
}

function getProductImage(product) {
  return resolveImage(
    product?.mainImageUrl || product?.thumbnail || product?.images?.[0],
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  );
}

function SectionHeading({ eyebrow, title, description, to, cta }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {to && cta ? (
        <Link
          to={to}
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          {cta}
          <ChevronRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}

function SkeletonHome() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-[420px] rounded-[2rem] bg-slate-200" />
        <div className="h-[420px] rounded-[2rem] bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-3xl bg-slate-200" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomePagePro() {
  const [products, setProducts] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [merchandising, setMerchandising] = useState(defaultHomeMerchandising);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, f, b] = await Promise.all([
          productApi.getProducts({ pageSize: 8 }),
          productApi.getProducts({ promotion: "flash-sale", pageSize: 6 }),
          blogApi.getAll({ page: 1, pageSize: 3 }),
        ]);

        const productItems = p?.data || p?.items || [];
        const flashSaleItems = f?.data || f?.items || [];

        setProducts(productItems);
        setFlashSale(flashSaleItems);
        setBlogs(b?.items || []);
      } catch (err) {
        console.error("API lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    voucherApi.getPublic().then((items) => setVouchers(items ?? [])).catch(() => setVouchers([]));
    homeMerchandisingApi.getPublic().then((config) => {
      setMerchandising({
        ...defaultHomeMerchandising,
        ...config,
        quickCollections: config?.quickCollections?.length
          ? config.quickCollections
          : defaultHomeMerchandising.quickCollections,
        serviceCards: config?.serviceCards?.length
          ? config.serviceCards
          : defaultHomeMerchandising.serviceCards,
      });
    });
  }, []);

  if (loading) return <SkeletonHome />;

  const heroProduct = flashSale[0] || products[0];
  const featuredProducts = products.slice(0, 8);
  const spotlightProducts = products.slice(0, 3);
  const heroImage = getProductImage(heroProduct);
  const heroSpecs = getSpecChips(heroProduct);
  const serviceCards = merchandising.serviceCards?.length
    ? merchandising.serviceCards
    : featuredProducts.slice(0, 3).map((product, index) => ({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.mainImageUrl,
        price: product.promotionalPrice ?? product.salePrice ?? product.price,
        description: `Gợi ý nổi bật từ ${product.brand || "TechStore"} cho nhu cầu nâng cấp nhanh.`,
        theme: ["yellow", "emerald", "blue"][index] ?? "blue",
      }));

  return (
    <div className="space-y-14 pb-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#ffffff_42%,_#eef6ff_100%)] p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] md:p-6">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.14),_transparent_60%)] lg:block" />

        <div className="relative grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[1.75rem] bg-slate-950 px-6 py-8 text-white md:px-8 md:py-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                {merchandising.heroTitle}
              </h1>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/danh-muc"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:translate-x-0.5"
              >
                Khám phá sản phẩm
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Xem tin công nghệ
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-100 blur-2xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                <Smartphone size={14} />
                Điện thoại nổi bật
              </div>

              <h3 className="text-xl font-black text-slate-950">
                {heroProduct?.name || "Chọn smartphone hợp gu của bạn"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mức giá minh bạch, hình ảnh rõ ràng và phần thông số ngắn gọn
                giúp người xem nắm nhanh cấu hình ngay từ hero.
              </p>

              {heroSpecs.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {heroSpecs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Giá tham khảo
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950">
                    {heroProduct?.price ? formatVnd(heroProduct.price) : "Đang cập nhật"}
                  </p>
                </div>

                <div className="rounded-2xl bg-red-50 px-3 py-2 text-red-600">
                  <p className="text-[11px] uppercase tracking-[0.22em]">
                    Ưu đãi
                  </p>
                  <p className="mt-1 text-sm font-bold">Flash sale mỗi ngày</p>
                </div>
              </div>

              <img
                src={heroImage}
                alt={heroProduct?.name || "Hero product"}
                className="mt-5 h-56 w-full rounded-[1.25rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {trustHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {vouchers.length > 0 ? (
        <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-[linear-gradient(140deg,_#ecfdf5_0%,_#ffffff_40%,_#f0fdf4_100%)] p-5 shadow-sm md:p-6">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-lime-200/40 blur-3xl" />

          <div className="relative">
            <SectionHeading
              eyebrow="Mã giảm giá"
              title="Mã giảm giá hot trong ngày"
              description="Sao chép mã nhanh và áp dụng ở giỏ hàng để nhận mức giá tốt hơn."
              to="/gio-hang"
              cta="Đến giỏ hàng"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vouchers.slice(0, 3).map((voucher) => (
                <article
                  key={voucher.code}
                  className="group relative overflow-hidden rounded-[1.25rem] border border-emerald-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100 blur-2xl transition group-hover:scale-110" />
                  <div className="relative">
                    <p className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                      <TicketPercent size={13} />
                      Voucher công khai
                    </p>

                    <p className="mt-3 text-sm text-slate-500">Mã ưu đãi</p>
                    <p className="mt-1 inline-flex rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-2 font-black tracking-[0.08em] text-emerald-700">
                      {voucher.code}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Mức giảm
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-950">
                          {voucher.discountPercent}%
                        </p>
                      </div>
                      <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {voucher.maxDiscountAmount
                          ? `Tối đa ${formatVnd(voucher.maxDiscountAmount)}`
                          : "Không giới hạn trần"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-[linear-gradient(135deg,_#fff5f5_0%,_#ffffff_34%,_#fff1f2_100%)] p-5 shadow-sm md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl" />

        <SectionHeading
          eyebrow="Deal Nóng"
          title="Flash Sale đang chạy"
          description="Một khu vực có nhiệt, có countdown và mật độ sản phẩm cao để đẩy nhận diện ưu đãi ngay khi vào trang chủ."
          to="/danh-muc"
          cta="Xem toàn bộ deal"
        />

        <div className="relative mt-6 flex flex-col gap-4 rounded-[1.5rem] border border-red-100 bg-white/85 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-red-500">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/30">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-red-400/30" />
              <Flame size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Deal giảm giá có giới hạn
              </h3>
              <p className="text-sm text-slate-600">
                Cạnh tranh giá tốt, cập nhật nhanh và ưu tiên hiển thị sản phẩm
                đang giảm giá.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Ưu đãi đang chạy
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              Số lượng giới hạn
            </span>
          </div>

          <div>
            <FlashSaleCountdown />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {flashSale.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Nổi bật"
          title="Sản phẩm nổi bật được chọn để lên trang chủ"
          description="Khung hiển thị sạch, khoảng trắng thoáng và card sản phẩm đồng nhất để tạo cảm giác một storefront chuyên nghiệp."
          to="/danh-muc"
          cta="Xem tất cả sản phẩm"
        />

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              <Gift size={14} />
              Chọn nhanh
            </p>

            <h3 className="mt-4 text-3xl font-black tracking-tight">
              Chọn nhanh nhóm điện thoại đang được săn đón nhiều nhất.
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Khu vực này được nối trực tiếp với dữ liệu sản phẩm để hiển thị
              ảnh, giá và vài thông số ngắn gọn thay vì chỉ là khối trang trí.
            </p>

            <div className="mt-8 space-y-3">
              {spotlightProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      Top {index + 1}
                    </p>
                    <p className="mt-1 line-clamp-1 font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-300">
                      {getSpecChips(item).slice(0, 3).join(" • ") || "Thông số đang cập nhật"}
                    </p>
                  </div>
                  <p className="font-bold text-blue-200">{formatVnd(item.price)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featuredProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {serviceCards.map((item, index) => {
          const styles = [
            {
              wrapper: "border-yellow-200 bg-[linear-gradient(135deg,_#fff7d6_0%,_#fffdf4_100%)]",
              badge: "bg-yellow-400 text-slate-950",
              icon: Zap,
            },
            {
              wrapper: "border-emerald-200 bg-[linear-gradient(135deg,_#dcfce7_0%,_#f4fff8_100%)]",
              badge: "bg-emerald-500 text-white",
              icon: Truck,
            },
            {
              wrapper: "border-blue-200 bg-[linear-gradient(135deg,_#dbeafe_0%,_#f7fbff_100%)]",
              badge: "bg-blue-600 text-white",
              icon: Star,
            },
          ];
          const style = styles[index] ?? styles[0];
          const Icon = style.icon;

          return (
            <Link key={item.productId} to={`/san-pham/${item.slug}`} className={`rounded-[1.75rem] p-6 shadow-sm border block transition hover:-translate-y-1 ${style.wrapper}`}>
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${style.badge}`}>
                <Icon size={20} />
              </div>
              <h3 className="line-clamp-2 text-xl font-black text-slate-950">{item.name}</h3>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatVnd(item.price)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Tin tức"
          title="Tin công nghệ được đặt vào đúng tâm thế storefront"
          description="Không để blog bị xem như phần phụ. Bố cục này giúp trang chủ có chiều sâu nội dung và tăng cảm giác một thương hiệu có bản sắc."
          to="/blog"
          cta="Xem tất cả bài viết"
        />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          {blogs.map((blog, index) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className={`group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                index === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div className={`${index === 0 ? "h-72 lg:h-full" : "h-52"} overflow-hidden`}>
                <img
                  src={resolveImage(
                    blog.coverImageUrl,
                    "https://picsum.photos/900/600",
                  )}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <span>{formatBlogDate(blog.createdAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>Góc công nghệ</span>
                </div>

                <h3
                  className={`mt-3 font-black tracking-tight text-slate-950 transition group-hover:text-blue-600 ${
                    index === 0 ? "text-2xl" : "text-lg"
                  }`}
                >
                  {blog.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {blog.excerpt}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                  Đọc bài viết
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
