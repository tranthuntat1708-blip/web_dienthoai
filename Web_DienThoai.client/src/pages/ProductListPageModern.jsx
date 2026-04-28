import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Filter, SlidersHorizontal, Sparkles, TicketPercent, X } from "lucide-react";

import ProductCard from "../components/product/ProductCard";
import ProductFilterPanel from "../components/product/ProductFilterPanelVi";
import { productApi } from "../api/products";
import { voucherApi } from "../api/vouchers";
import { resolveImage } from "../utils/imageResolver";
import { formatVnd } from "../utils/format";

const CATALOG_FETCH_SIZE = 200;

const PRODUCT_TYPE_LABELS = {
  phone: "Điện thoại",
  tablet: "Tablet",
  audio: "Âm thanh",
  watch: "Đồng hồ",
  accessory: "Phụ kiện",
};

function getDisplayPrice(product) {
  return product.promotionalPrice ?? product.salePrice ?? product.price ?? 0;
}

function getSegment(product) {
  const price = getDisplayPrice(product);
  if (price < 5_000_000) return "entry";
  if (price < 15_000_000) return "mid";
  if (price < 25_000_000) return "upper";
  return "flagship";
}

function sortStorageValue(value) {
  if (!value) return 0;
  if (value.includes("TB")) return Number.parseInt(value, 10) * 1024;
  return Number.parseInt(value, 10);
}

export default function ProductListPageModern() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    productTypes: [],
    rams: [],
    storages: [],
  });

  const filters = {
    categorySlug: searchParams.get("category") || undefined,
    q: searchParams.get("q") || undefined,
    productType: searchParams.get("productType") || undefined,
    brand: searchParams.get("brand") || undefined,
    ram: searchParams.get("ram") || undefined,
    storage: searchParams.get("storage") || undefined,
    segment: searchParams.get("segment") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: searchParams.get("sortBy") || "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: 12,
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    productApi
      .getProducts({ page: 1, pageSize: CATALOG_FETCH_SIZE })
      .then((res) => {
        if (cancelled) return;

        let data = res.items || [];
        const sourceData = [...data];

        setFilterOptions({
          brands: [...new Set(sourceData.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi")),
          productTypes: [...new Set(sourceData.map((p) => p.productType).filter(Boolean))],
          rams: [...new Set(sourceData.map((p) => p.ram).filter(Boolean))].sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)),
          storages: [...new Set(sourceData.map((p) => p.storage).filter(Boolean))].sort((a, b) => sortStorageValue(a) - sortStorageValue(b)),
        });

        if (filters.q) data = data.filter((p) => p.name.toLowerCase().includes(filters.q.toLowerCase()));
        if (filters.categorySlug) data = data.filter((p) => p.category?.slug === filters.categorySlug);
        if (filters.productType) data = data.filter((p) => p.productType === filters.productType);
        if (filters.brand) data = data.filter((p) => p.brand === filters.brand);
        if (filters.ram) data = data.filter((p) => p.ram === filters.ram);
        if (filters.storage) data = data.filter((p) => p.storage === filters.storage);
        if (filters.segment) data = data.filter((p) => getSegment(p) === filters.segment);
        if (filters.minPrice !== undefined) data = data.filter((p) => getDisplayPrice(p) >= filters.minPrice);
        if (filters.maxPrice !== undefined) data = data.filter((p) => getDisplayPrice(p) <= filters.maxPrice);

        if (filters.sortBy === "price_asc") data.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        else if (filters.sortBy === "price_desc") data.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        else if (filters.sortBy === "best_seller") data.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));

        const mapped = data.map((p) => ({ ...p, mainImageUrl: resolveImage(p.images?.[0] || p.mainImageUrl) }));
        const start = (filters.page - 1) * filters.pageSize;
        const end = start + filters.pageSize;

        setProducts(mapped.slice(start, end));
        setTotal(mapped.length);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    voucherApi.getPublic().then((items) => !cancelled && setVouchers(items ?? [])).catch(() => !cancelled && setVouchers([]));
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFilterChange(changed) {
    const next = new URLSearchParams(searchParams);
    const isPageOnlyChange = Object.keys(changed).length === 1 && Object.prototype.hasOwnProperty.call(changed, "page");

    Object.entries(changed).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });

    if (!isPageOnlyChange) next.set("page", "1");
    setSearchParams(next);
  }

  const totalPages = Math.ceil(total / filters.pageSize);
  const pageTitle = filters.q
    ? `Kết quả tìm kiếm: "${filters.q}"`
    : filters.categorySlug
      ? `Danh mục ${filters.categorySlug}`
      : "Tất cả sản phẩm";

  const sortLabel = {
    newest: "Mới nhất",
    best_seller: "Bán chạy",
    price_asc: "Giá tăng",
    price_desc: "Giá giảm",
  }[filters.sortBy] || "Mới nhất";

  const activeFilterChips = useMemo(
    () =>
      [
        filters.productType ? `Loại: ${PRODUCT_TYPE_LABELS[filters.productType] || filters.productType}` : null,
        filters.brand ? `Thương hiệu: ${filters.brand}` : null,
        filters.ram ? `RAM: ${filters.ram}` : null,
        filters.storage ? `Bộ nhớ: ${filters.storage}` : null,
        filters.segment ? `Phân khúc: ${filters.segment}` : null,
        filters.minPrice !== undefined || filters.maxPrice !== undefined
          ? `Giá: ${filters.minPrice ? filters.minPrice.toLocaleString("vi-VN") : "0"} - ${filters.maxPrice ? filters.maxPrice.toLocaleString("vi-VN") : "∞"}`
          : null,
      ].filter(Boolean),
    [filters],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="relative mb-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.14),_transparent_38%),linear-gradient(140deg,_#ffffff_0%,_#f8fbff_45%,_#eff6ff_100%)] p-5 shadow-sm md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Sparkles size={12} />
              Danh mục
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{pageTitle}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {total} sản phẩm phù hợp. Tinh chỉnh bộ lọc để thu hẹp kết quả nhanh hơn.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <ArrowUpDown size={15} />
            <span>
              Đang sắp xếp: <b className="text-slate-900">{sortLabel}</b>
            </span>
          </div>

          <button
            onClick={() => setFilterOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 md:hidden"
          >
            <SlidersHorizontal size={16} /> Bộ lọc
          </button>
        </div>
      </section>

      {vouchers.length > 0 ? (
        <section className="relative mb-6 overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-[linear-gradient(135deg,_#ecfdf5_0%,_#ffffff_42%,_#f0fdf4_100%)] p-4 shadow-sm">
          <div className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-200/55 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-36 w-36 rounded-full bg-lime-200/45 blur-3xl" />

          <div className="relative flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
              <TicketPercent size={12} />
              Ưu đãi mã giảm giá
            </p>

            {vouchers.slice(0, 4).map((voucher) => (
              <button
                key={voucher.code}
                type="button"
                onClick={() => navigator.clipboard?.writeText(voucher.code)}
                className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow"
                title="Bấm để sao chép mã"
              >
                <span className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-2 py-0.5 font-black tracking-[0.08em] text-emerald-700">
                  {voucher.code}
                </span>
                <span>-{voucher.discountPercent}%</span>
                {voucher.maxDiscountAmount ? <span className="text-slate-500">max {formatVnd(voucher.maxDiscountAmount)}</span> : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          <Filter size={12} />
          Bộ lọc đang áp dụng
        </span>

        {activeFilterChips.length === 0 ? (
          <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400">Chưa chọn bộ lọc</span>
        ) : (
          activeFilterChips.map((chip) => (
            <span key={chip} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {chip}
            </span>
          ))
        )}
      </div>

      <div className="flex gap-6">
        <aside
          className={`
            ${filterOpen ? "fixed inset-0 z-40 bg-white p-4" : "hidden"}
            w-full md:sticky md:top-24 md:z-auto md:block md:h-fit md:w-64 md:bg-transparent md:p-0
          `}
        >
          {filterOpen ? (
            <div className="mb-4 flex justify-between">
              <span className="font-semibold text-slate-800">Bộ lọc</span>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
          ) : null}

          <ProductFilterPanel
            filters={filters}
            options={filterOptions}
            productTypeLabels={PRODUCT_TYPE_LABELS}
            onChange={handleFilterChange}
          />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-gray-400">
              <p className="mb-4 text-5xl">🔎</p>
              <p>Không tìm thấy sản phẩm</p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handleFilterChange({ page })}
                      className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                        page === filters.page
                          ? "bg-slate-900 text-white shadow"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
