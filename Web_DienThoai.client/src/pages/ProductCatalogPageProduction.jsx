import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "../components/product/ProductCardProduction";
import ProductFilterPanel from "../components/product/ProductFilterPanelVi";
import { productApi } from "../api/products";
import { resolveImage } from "../utils/imageResolver";

const CATALOG_FETCH_SIZE = 200;
const PAGE_SIZE = 12;

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

export default function ProductCatalogPageProduction() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    productTypes: [],
    rams: [],
    storages: [],
  });

  const filters = {
    q: searchParams.get("q") || undefined,
    categorySlug: searchParams.get("category") || undefined,
    productType: searchParams.get("productType") || undefined,
    brand: searchParams.get("brand") || undefined,
    ram: searchParams.get("ram") || undefined,
    storage: searchParams.get("storage") || undefined,
    segment: searchParams.get("segment") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sortBy: searchParams.get("sortBy") || "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
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
          rams: [...new Set(sourceData.map((p) => p.ram).filter(Boolean))].sort(
            (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10),
          ),
          storages: [...new Set(sourceData.map((p) => p.storage).filter(Boolean))].sort(
            (a, b) => sortStorageValue(a) - sortStorageValue(b),
          ),
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
        const start = (filters.page - 1) * PAGE_SIZE;
        setProducts(mapped.slice(start, start + PAGE_SIZE));
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

  function handleFilterChange(changed) {
    const next = new URLSearchParams(searchParams);
    const isPageOnlyChange = Object.keys(changed).length === 1 && Object.prototype.hasOwnProperty.call(changed, "page");

    Object.entries(changed).forEach(([key, value]) => {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    });

    if (!isPageOnlyChange) next.set("page", "1");
    setSearchParams(next);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const sortLabel = {
    newest: "Mới nhất",
    best_seller: "Bán chạy",
    price_asc: "Giá tăng",
    price_desc: "Giá giảm",
  }[filters.sortBy] || "Mới nhất";

  const pageTitle = filters.q
    ? `Kết quả tìm kiếm: "${filters.q}"`
    : filters.categorySlug
      ? `Danh mục ${filters.categorySlug}`
      : "Tất cả sản phẩm";

  const activeFilterCount = useMemo(
    () =>
      [
        filters.productType,
        filters.brand,
        filters.ram,
        filters.storage,
        filters.segment,
        filters.minPrice,
        filters.maxPrice,
      ].filter((item) => item !== undefined && item !== "").length,
    [filters],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-950 md:text-3xl">{pageTitle}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {total} sản phẩm phù hợp. Tập trung vào bộ lọc cần thiết để ra quyết định nhanh hơn.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <ArrowUpDown size={14} />
            {sortLabel}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
          >
            <SlidersHorizontal size={15} />
            Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
            >
              Xóa toàn bộ lọc
            </button>
          ) : null}
        </div>
      </section>

      <div className="flex gap-6">
        <aside
          className={`
            ${filterOpen ? "fixed inset-0 z-40 bg-white p-4" : "hidden"}
            w-full md:sticky md:top-24 md:block md:h-fit md:w-64 md:bg-transparent md:p-0
          `}
        >
          {filterOpen ? (
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-slate-900">Bộ lọc</p>
              <button type="button" onClick={() => setFilterOpen(false)}>
                <X size={18} />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-slate-500">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      className={`h-9 w-9 rounded-xl text-sm font-semibold ${
                        page === filters.page
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 bg-white text-slate-600"
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

