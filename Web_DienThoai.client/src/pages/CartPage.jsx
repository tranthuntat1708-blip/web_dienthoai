import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { formatVnd } from "../utils/format";
import toast from "react-hot-toast";
import apiClient from "../api/client";

const FALLBACK_IMG = "https://placehold.co/100x100/e2e8f0/64748b?text=No+Image";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX: đảm bảo không bị NaN
  const subtotal = items.reduce(
    (s, i) => s + (i.unitPrice || 0) * (i.quantity || 0),
    0,
  );

  const discount = voucher
    ? Math.min(
        voucher.maxDiscountAmount || 0,
        (subtotal * (voucher.discountPercent || 0)) / 100,
      )
    : 0;

  const finalAmount = Math.max(subtotal - discount, 0);

  // ✅ VALIDATE VOUCHER
  async function handleValidateVoucher() {
    if (!voucherCode.trim()) return;

    setVoucherLoading(true);
    try {
      const res = await apiClient.post("/vouchers/validate", {
        code: voucherCode,
        orderAmount: subtotal,
      });

      setVoucher(res.data);
      toast.success(`Áp dụng mã thành công! Giảm ${res.data.discountPercent}%`);
    } catch {
      setVoucher(null);
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
    } finally {
      setVoucherLoading(false);
    }
  }

  // ✅ GIỎ HÀNG TRỐNG
  if (!items || items.length === 0)
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">Hãy thêm điện thoại vào giỏ hàng!</p>
        <Link to="/danh-muc" className="btn-primary">
          Tiếp tục mua sắm
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng ({items.length})</h1>
        <Link
          to="/danh-muc"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* DANH SÁCH */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => {
            const price = item.promotionalPrice || item.unitPrice || 0;

            return (
              <div
                key={item.productId}
                className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4"
              >
                {/* IMAGE */}
                <img
                  src={item.mainImageUrl || FALLBACK_IMG}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  alt={item.productName}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                />

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.productName}
                  </p>

                  {/* PRICE */}
                  {item.promotionalPrice ? (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                        SALE
                      </span>
                      <span className="text-red-600 font-bold">
                        {formatVnd(item.promotionalPrice)}
                      </span>
                      <span className="text-gray-400 line-through text-xs">
                        {formatVnd(item.originalPrice)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-blue-600 font-bold mt-1">
                      {formatVnd(price)}
                    </p>
                  )}
                </div>

                {/* QUANTITY */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-9 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* TOTAL */}
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatVnd(price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="mt-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="space-y-4 md:sticky md:top-24 md:h-fit">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-900">Tóm tắt đơn hàng</h2>

            {/* VOUCHER */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Mã giảm giá"
                  className="input pl-8 uppercase text-sm"
                />
              </div>

              <button
                onClick={handleValidateVoucher}
                disabled={voucherLoading}
                className="btn-outline text-sm px-3"
              >
                Áp dụng
              </button>
            </div>

            {/* PRICE */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatVnd(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm ({voucher.discountPercent}%)</span>
                  <span>-{formatVnd(discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                <span>Tổng</span>
                <span className="text-blue-600">{formatVnd(finalAmount)}</span>
              </div>
            </div>

            {/* CHECKOUT */}
            <button
              onClick={() =>
                navigate("/thanh-toan", {
                  state: {
                    voucherCode: voucher?.code,
                    finalAmount,
                  },
                })
              }
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Thanh toán <ArrowRight size={18} />
            </button>
            <p className="text-xs text-slate-500">
              Bạn có thể chọn VNPay, chuyển khoản QR hoặc COD ở bước thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
