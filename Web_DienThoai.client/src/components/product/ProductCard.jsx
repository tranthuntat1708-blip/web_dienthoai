import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Scale } from "lucide-react";
import { formatVnd } from "../../utils/format";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useAuthStore } from "../../store/authStore";
import { useCompareStore } from "../../store/compareStore";
import toast from "react-hot-toast";

const FALLBACK_IMG = "https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image";

function getSpecBadges(product) {
  if (!product) return [];

  if (product.featureBadges?.length) {
    return product.featureBadges.slice(0, 4);
  }

  return [
    product.brand,
    product.ram && `RAM ${product.ram}`,
    product.storage && `${product.storage}`,
    product.camera && `Camera ${product.camera}`,
    product.battery && `Pin ${product.battery}`,
    product.screen && `Màn ${product.screen}`,
    product.color && `${product.color}`,
  ].filter(Boolean).slice(0, 4);
}

export default function ProductCard({ product }) {
  const { id, slug, name, price, promotion, rating, reviews } = product;

  const addItem = useCartStore((s) => s.addItem);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const compareItems = useCompareStore((s) => s.items);
  const toggleCompare = useCompareStore((s) => s.toggle);
  const { user } = useAuthStore();

  const isWishlisted = wishlistIds.includes(id);
  const isCompared = compareItems.some((item) => item.id === id);

  // ✅ FIX IMAGE CHUẨN
  const imgSrc =
    product?.mainImageUrl ||
    product?.thumbnail ||
    product?.images?.[0] ||
    FALLBACK_IMG;

  // ✅ FIX GIÁ
  const discount = promotion?.discount || 0;
  const isOnSale = discount > 0;
  const salePrice = isOnSale ? Math.round(price * (1 - discount / 100)) : null;
  const specBadges = getSpecBadges(product);
  const stockLabel =
    typeof product?.stock === "number"
      ? product.stock > 0
        ? `Còn hàng (${product.stock})`
        : "Hết hàng"
      : null;

  function handleAddCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success("Đã thêm vào giỏ");
  }

  async function handleToggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const res = await toggleWishlist(id);
      toast.success(res?.message || "Đã cập nhật yêu thích");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  }

  function handleToggleCompare(e) {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(product);
    toast.success(result.message);
  }

  return (
    <Link
      to={`/san-pham/${slug || id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
        />

        {/* SALE */}
        {isOnSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
            -{discount}%
          </div>
        )}

        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow
          ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 hover:bg-red-100"
          }`}
          >
            <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
          </button>

          <button
            onClick={handleToggleCompare}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${
              isCompared ? "bg-slate-950 text-white" : "bg-white/80 hover:bg-slate-100"
            }`}
            title={isCompared ? "Bỏ so sánh" : "So sánh"}
          >
            <Scale size={16} />
          </button>
        </div>

        {/* ADD CART */}
        <button
          onClick={handleAddCart}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm py-2 opacity-0 group-hover:opacity-100 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart size={14} />
            Thêm vào giỏ
          </div>
        </button>
      </div>

      {/* INFO */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[36px]">
          {name}
        </h3>

        {specBadges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* RATING */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-gray-400">({reviews})</span>
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-red-500 font-bold text-sm">
                {formatVnd(salePrice)}
              </span>
              <span className="text-gray-400 line-through text-xs">
                {formatVnd(price)}
              </span>
            </>
          ) : (
            <span className="text-blue-600 font-bold text-sm">
              {formatVnd(price)}
            </span>
          )}
        </div>

        {stockLabel && (
          <p
            className={`text-[11px] font-medium ${
              product.stock > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {stockLabel}
          </p>
        )}
      </div>
    </Link>
  );
}
