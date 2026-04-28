import { useEffect, useState } from "react";

const SEGMENT_OPTIONS = [
  { value: "entry", label: "Dưới 5 triệu" },
  { value: "mid", label: "5 - 15 triệu" },
  { value: "upper", label: "15 - 25 triệu" },
  { value: "flagship", label: "Trên 25 triệu" },
];

const PRICE_OPTIONS = [
  { label: "Dưới 5 triệu", min: 0, max: 5_000_000 },
  { label: "5 - 10 triệu", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 20 triệu", min: 10_000_000, max: 20_000_000 },
  { label: "Trên 20 triệu", min: 20_000_000, max: "" },
];

function FilterSection({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      {children}
    </div>
  );
}

function ChipGroup({ items, value, onSelect, allLabel = "Tất cả" }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
          !value
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
        }`}
      >
        {allLabel}
      </button>

      {items.map((item) => {
        const option = typeof item === "string" ? { value: item, label: item } : item;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              value === option.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProductFilterPanelClean({
  filters,
  options = {},
  productTypeLabels = {},
  onChange,
}) {
  const productTypeOptions = (options.productTypes || []).map((type) => ({
    value: type,
    label: productTypeLabels[type] || type,
  }));

  const [local, setLocal] = useState({
    productType: filters.productType || "",
    brand: filters.brand || "",
    ram: filters.ram || "",
    storage: filters.storage || "",
    segment: filters.segment || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    sortBy: filters.sortBy || "newest",
  });

  useEffect(() => {
    setLocal({
      productType: filters.productType || "",
      brand: filters.brand || "",
      ram: filters.ram || "",
      storage: filters.storage || "",
      segment: filters.segment || "",
      minPrice: filters.minPrice || "",
      maxPrice: filters.maxPrice || "",
      sortBy: filters.sortBy || "newest",
    });
  }, [filters]);

  function handleChange(key, value) {
    setLocal((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  }

  function handlePrice(min, max) {
    setLocal((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));

    onChange({
      minPrice: min,
      maxPrice: max,
    });
  }

  function clearAll() {
    setLocal({
      productType: "",
      brand: "",
      ram: "",
      storage: "",
      segment: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });

    onChange({
      productType: "",
      brand: "",
      ram: "",
      storage: "",
      segment: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <FilterSection title="Sắp Xếp">
        <select
          value={local.sortBy}
          onChange={(event) => handleChange("sortBy", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
        >
          <option value="newest">Mới nhất</option>
          <option value="best_seller">Bán chạy</option>
          <option value="price_asc">Giá tăng</option>
          <option value="price_desc">Giá giảm</option>
        </select>
      </FilterSection>

      {productTypeOptions.length > 0 && (
        <FilterSection title="Loại Sản Phẩm">
          <ChipGroup
            items={productTypeOptions}
            value={local.productType}
            onSelect={(value) => handleChange("productType", value)}
          />
        </FilterSection>
      )}

      {options.brands?.length > 0 && (
        <FilterSection title="Thương Hiệu">
          <ChipGroup
            items={options.brands}
            value={local.brand}
            onSelect={(value) => handleChange("brand", value)}
          />
        </FilterSection>
      )}

      <FilterSection title="Phân Khúc">
        <ChipGroup
          items={SEGMENT_OPTIONS}
          value={local.segment}
          onSelect={(value) => handleChange("segment", value)}
        />
      </FilterSection>

      {options.rams?.length > 0 && (
        <FilterSection title="RAM">
          <ChipGroup
            items={options.rams}
            value={local.ram}
            onSelect={(value) => handleChange("ram", value)}
          />
        </FilterSection>
      )}

      {options.storages?.length > 0 && (
        <FilterSection title="Bộ Nhớ">
          <ChipGroup
            items={options.storages}
            value={local.storage}
            onSelect={(value) => handleChange("storage", value)}
          />
        </FilterSection>
      )}

      <FilterSection title="Khoảng Giá">
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handlePrice(option.min, option.max)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                local.minPrice === option.min && local.maxPrice === option.max
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
