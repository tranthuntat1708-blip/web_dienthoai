import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import { formatVnd } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";

const FALLBACK_IMG = "https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image";

export default function ProductCardProduction({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const displayPrice = product.promotionalPrice ?? product.salePrice ?? product.price ?? 0;
  const hasDiscount = Number(product.price) > Number(displayPrice);
  const slugOrId = product.slug || product.id;

  function handleAddCart(event) {
    event.preventDefault();
    event.stopPropagation();
    addItem(product, 1);
    toast.success("Đã thêm vào giỏ");
  }

  return (
    <Link
      to={`/san-pham/${slugOrId}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={product.mainImageUrl || product.thumbnail || product.images?.[0] || FALLBACK_IMG}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMG;
          }}
        />
        {hasDiscount ? (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
            Giảm
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900">{product.name}</h3>

        <div className="space-y-1">
          <p className="text-lg font-black text-blue-700">{formatVnd(displayPrice)}</p>
          {hasDiscount ? (
            <p className="text-xs text-slate-400 line-through">{formatVnd(product.price)}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAddCart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <ShoppingCart size={15} />
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
}

