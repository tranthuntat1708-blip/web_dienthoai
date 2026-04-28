import { Link } from "react-router-dom";
import { Scale, Trash2 } from "lucide-react";

import { useCompareStore } from "../store/compareStore";
import { resolveImage } from "../utils/imageResolver";
import { formatVnd } from "../utils/format";

const compareRows = [
  ["Giá hiện tại", (item) => formatVnd(item.price)],
  ["Giá niêm yết", (item) => formatVnd(item.originalPrice)],
  ["Chip", (item) => item.chip || "Đang cập nhật"],
  ["RAM", (item) => item.ram || "Đang cập nhật"],
  ["Bộ nhớ", (item) => item.storage || "Đang cập nhật"],
  ["Màn hình", (item) => item.screen || "Đang cập nhật"],
  ["Camera", (item) => item.camera || "Đang cập nhật"],
  ["Pin", (item) => item.battery || "Đang cập nhật"],
  ["Sạc", (item) => item.charging || "Đang cập nhật"],
  ["Kết nối", (item) => item.connectivity || "Đang cập nhật"],
  ["Màu", (item) => item.color || "Đang cập nhật"],
  ["Tồn kho", (item) => (typeof item.stock === "number" ? `${item.stock} sản phẩm` : "Đang cập nhật")],
];

export default function ComparePage() {
  const items = useCompareStore((state) => state.items);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              So sánh sản phẩm
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Đặt các mẫu máy cạnh nhau trước khi chốt đơn
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Bảng so sánh này gom các thông số thường được cân nhắc nhất để người mua ra quyết định nhanh hơn.
            </p>
          </div>

          {items.length > 0 ? (
            <button type="button" onClick={clear} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
              Xóa toàn bộ
            </button>
          ) : null}
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <Scale className="mx-auto text-slate-300" size={42} />
          <h2 className="mt-4 text-xl font-black text-slate-950">Chưa có sản phẩm để so sánh</h2>
          <p className="mt-2 text-sm text-slate-500">
            Thêm sản phẩm từ card hoặc trang chi tiết để bắt đầu đối chiếu.
          </p>
          <Link to="/danh-muc" className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Đi tới danh mục
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <p className="border-b border-slate-100 px-5 py-3 text-xs text-slate-500 md:hidden">
            Vuốt ngang để xem đầy đủ bảng so sánh trên màn hình nhỏ.
          </p>
          <div className="min-w-[760px]">
            <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `240px repeat(${items.length}, minmax(0, 1fr))` }}>
              <div className="p-5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Tiêu chí</div>
              {items.map((item) => (
                <div key={item.id} className="border-l border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/san-pham/${item.slug}`} className="min-w-0">
                      <img src={resolveImage(item.mainImageUrl)} alt={item.name} className="h-32 w-full rounded-2xl object-cover" />
                      <p className="mt-3 line-clamp-2 font-bold text-slate-950">{item.name}</p>
                    </Link>

                    <button type="button" onClick={() => remove(item.id)} className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {compareRows.map(([label, getter], index) => (
              <div key={label} className="grid" style={{ gridTemplateColumns: `240px repeat(${items.length}, minmax(0, 1fr))` }}>
                <div className={`p-5 text-sm font-semibold text-slate-500 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}`}>{label}</div>
                {items.map((item) => (
                  <div key={`${item.id}-${label}`} className={`border-l border-slate-200 p-5 text-sm text-slate-900 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}`}>
                    {getter(item)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
