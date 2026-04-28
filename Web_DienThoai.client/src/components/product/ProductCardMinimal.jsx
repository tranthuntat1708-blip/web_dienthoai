import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "../../store/cartStore";
import { formatVnd } from "../../utils/format";

const FALLBACK_IMG = "https://placehold.co/640x480/e2e8f0/64748b?text=No+Image";

export default function ProductCardMinimal({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const listPrice = product.price ?? 0;
  const salePrice = product.promotionalPrice ?? product.salePrice ?? listPrice;
  const hasDiscount = Number(salePrice) < Number(listPrice);

  function onAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    toast.success("Đã thêm vào giỏ");
  }

  return (
    <Link
      to={`/san-pham/${product.slug || product.id}`}
      className="group surface-card block p-3 transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product.mainImageUrl || product.thumbnail || product.images?.[0] || FALLBACK_IMG}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-900">{product.name}</h3>

        <div className="space-y-1">
          <p className="text-lg font-bold text-slate-900">{formatVnd(salePrice)}</p>
          {hasDiscount ? <p className="text-xs text-slate-400 line-through">{formatVnd(listPrice)}</p> : null}
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <ShoppingCart size={15} />
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
}
