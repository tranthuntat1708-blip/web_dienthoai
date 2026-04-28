import { useEffect, useState } from "react";

const SEGMENT_OPTIONS = [
  { value: "entry", label: "Duoi 5 trieu" },
  { value: "mid", label: "5 - 15 trieu" },
  { value: "upper", label: "15 - 25 trieu" },
  { value: "flagship", label: "Tren 25 trieu" },
];

const PRICE_OPTIONS = [
  { label: "Duoi 5 trieu", min: 0, max: 5_000_000 },
  { label: "5 - 10 trieu", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 20 trieu", min: 10_000_000, max: 20_000_000 },
  { label: "Tren 20 trieu", min: 20_000_000, max: "" },
];

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      {children}
    </div>
  );
}

function ChipGroup({ items, value, onSelect, allLabel = "Tat ca" }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          !value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              value === option.value
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProductFilterPanelMinimal({
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

  function setFilter(key, value) {
    setLocal((prev) => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  }

  function setPrice(min, max) {
    setLocal((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    onChange({ minPrice: min, maxPrice: max });
  }

  function clearAll() {
    const reset = {
      productType: "",
      brand: "",
      ram: "",
      storage: "",
      segment: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };
    setLocal(reset);
    onChange(reset);
  }

  return (
    <div className="surface-card space-y-6 p-4">
      <Section title="Sap xep">
        <select
          value={local.sortBy}
          onChange={(event) => setFilter("sortBy", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
        >
          <option value="newest">Moi nhat</option>
          <option value="best_seller">Ban chay</option>
          <option value="price_asc">Gia tang</option>
          <option value="price_desc">Gia giam</option>
        </select>
      </Section>

      {productTypeOptions.length > 0 ? (
        <Section title="Loai san pham">
          <ChipGroup items={productTypeOptions} value={local.productType} onSelect={(value) => setFilter("productType", value)} />
        </Section>
      ) : null}

      {options.brands?.length > 0 ? (
        <Section title="Thuong hieu">
          <ChipGroup items={options.brands} value={local.brand} onSelect={(value) => setFilter("brand", value)} />
        </Section>
      ) : null}

      <Section title="Phan khuc">
        <ChipGroup items={SEGMENT_OPTIONS} value={local.segment} onSelect={(value) => setFilter("segment", value)} />
      </Section>

      {options.rams?.length > 0 ? (
        <Section title="RAM">
          <ChipGroup items={options.rams} value={local.ram} onSelect={(value) => setFilter("ram", value)} />
        </Section>
      ) : null}

      {options.storages?.length > 0 ? (
        <Section title="Bo nho">
          <ChipGroup items={options.storages} value={local.storage} onSelect={(value) => setFilter("storage", value)} />
        </Section>
      ) : null}

      <Section title="Khoang gia">
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setPrice(option.min, option.max)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                local.minPrice === option.min && local.maxPrice === option.max
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Section>

      <button
        type="button"
        onClick={clearAll}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        Xoa bo loc
      </button>
    </div>
  );
}

