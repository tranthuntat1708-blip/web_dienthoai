import { useState } from "react";

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

export default function ProductFilter({
  filters,
  options = {},
  productTypeLabels = {},
  onChange,
}) {
  const [local, setLocal] = useState({
    brand: filters.brand || "",
    ram: filters.ram || "",
    storage: filters.storage || "",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    sortBy: filters.sortBy || "newest",
  });

  function handleChange(key, value) {
    const next = { ...local, [key]: value };
    setLocal(next);
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
      brand: "",
      ram: "",
      storage: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });

    onChange({
      brand: "",
      ram: "",
      storage: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  }

  return (
    <div className="bg-white rounded-xl p-4 border space-y-6">
      {/* SORT */}
      <div>
        <p className="font-semibold mb-2">Sắp xếp</p>
        <select
          value={local.sortBy}
          onChange={(e) => handleChange("sortBy", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng</option>
          <option value="price_desc">Giá giảm</option>
        </select>
      </div>

      {/* BRAND */}
      <div>
        <p className="font-semibold mb-2">Hãng</p>
        {["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo"].map((b) => (
          <label key={b} className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={local.brand === b}
              onChange={() => handleChange("brand", b)}
            />
            {b}
          </label>
        ))}
        <label className="flex gap-2 text-sm">
          <input
            type="radio"
            checked={!local.brand}
            onChange={() => handleChange("brand", "")}
          />
          Tất cả
        </label>
      </div>

      {/* RAM */}
      <div>
        <p className="font-semibold mb-2">RAM</p>
        {["4GB", "6GB", "8GB", "12GB"].map((r) => (
          <label key={r} className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={local.ram === r}
              onChange={() => handleChange("ram", r)}
            />
            {r}
          </label>
        ))}
      </div>

      {/* STORAGE */}
      <div>
        <p className="font-semibold mb-2">Bộ nhớ</p>
        {["64GB", "128GB", "256GB", "512GB"].map((s) => (
          <label key={s} className="flex gap-2 text-sm">
            <input
              type="radio"
              checked={local.storage === s}
              onChange={() => handleChange("storage", s)}
            />
            {s}
          </label>
        ))}
      </div>

      {/* PRICE */}
      <div>
        <p className="font-semibold mb-2">Khoảng giá</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handlePrice(0, 5000000)}
            className="btn-outline text-xs"
          >
            {"<5tr"}
          </button>
          <button
            onClick={() => handlePrice(5000000, 10000000)}
            className="btn-outline text-xs"
          >
            5-10tr
          </button>
          <button
            onClick={() => handlePrice(10000000, 20000000)}
            className="btn-outline text-xs"
          >
            10-20tr
          </button>
          <button
            onClick={() => handlePrice(20000000, "")}
            className="btn-outline text-xs"
          >
            {">20tr"}
          </button>
        </div>
      </div>

      {/* CLEAR */}
      <button
        onClick={clearAll}
        className="text-sm text-gray-500 hover:underline"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
