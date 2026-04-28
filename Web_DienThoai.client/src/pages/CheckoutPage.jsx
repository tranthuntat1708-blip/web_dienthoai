import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PaymentQR from "../components/payment/PaymentQR";
import { orderApi } from "../api/orders";
import { useCartStore } from "../store/cartStore";
import { formatVnd } from "../utils/format";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
  });

  const finalAmount = useMemo(
    () =>
      state?.finalAmount ?? items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items, state?.finalAmount],
  );

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handlePlaceOrder() {
    if (submitted || loading) return;

    if (!items.length) {
      toast.error("Giỏ hàng đang trống.");
      return;
    }

    if (!form.receiverName || !form.receiverPhone || !form.receiverAddress) {
      toast.error("Vui lòng điền đầy đủ thông tin nhận hàng.");
      return;
    }

    setLoading(true);
    setSubmitted(true);

    try {
      const result = await orderApi.createOrder({
        type: "Retail",
        receiverName: form.receiverName,
        receiverPhone: form.receiverPhone,
        receiverAddress: form.receiverAddress,
        paymentMethod,
        voucherCode: state?.voucherCode ?? null,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          mainImageUrl: item.mainImageUrl,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      });

      const summary = result?.orderSummary;

      if (!summary) {
        throw new Error("Không tạo được đơn hàng.");
      }

      if (paymentMethod === "vnpay" && result.paymentUrl) {
        clearCart();
        toast.success("Đang chuyển sang cổng thanh toán VNPay...");
        window.location.href = result.paymentUrl;
        return;
      }

      if (paymentMethod === "cod") {
        clearCart();
        toast.success("Đặt hàng thành công.");
        navigate("/dat-hang-thanh-cong", {
          state: {
            orderId: summary.id,
            orderCode: summary.orderCode,
            amount: summary.finalAmount,
          },
        });
        return;
      }

      clearCart();
      setCreatedOrder(summary);
      toast.success("Đơn hàng đã được tạo. Vui lòng quét mã QR để thanh toán.");
    } catch (error) {
      setSubmitted(false);
      const backendMessage = error?.response?.data?.message;
      const backendDetails = error?.response?.data?.details;
      const backendInner = error?.response?.data?.inner;
      const message =
        [backendMessage, backendDetails, backendInner]
          .filter(Boolean)
          .join(" | ") || error?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      if (import.meta.env.DEV) {
        console.error("Order create failed:", error?.response?.data ?? error);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const displayItems = createdOrder ? [] : items;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Thanh toán</h1>
          <Link
            to="/gio-hang"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Giỏ hàng</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-white">Thanh toán</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">Hoàn tất</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Thông tin nhận hàng</h2>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Họ và tên
                </label>
                <input
                  name="receiverName"
                  placeholder="Nguyễn Văn A"
                  value={form.receiverName}
                  onChange={handleChange}
                  className="input"
                  disabled={Boolean(createdOrder)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <input
                  name="receiverPhone"
                  placeholder="09xxxxxxxx"
                  value={form.receiverPhone}
                  onChange={handleChange}
                  className="input"
                  disabled={Boolean(createdOrder)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Địa chỉ nhận hàng
                </label>
                <textarea
                  name="receiverAddress"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={form.receiverAddress}
                  onChange={handleChange}
                  className="input min-h-28 resize-y"
                  disabled={Boolean(createdOrder)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Phương thức thanh toán</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("vnpay")}
                disabled={Boolean(createdOrder)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  paymentMethod === "vnpay" ? "border-blue-500 bg-blue-50" : "border-slate-200"
                } ${createdOrder ? "cursor-not-allowed opacity-60" : "hover:border-blue-300"}`}
              >
                <span className="font-semibold text-slate-900">VNPay</span>
                <span className="text-sm text-slate-500">ATM · QR · Visa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("qr")}
                disabled={Boolean(createdOrder)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  paymentMethod === "qr" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
                } ${createdOrder ? "cursor-not-allowed opacity-60" : "hover:border-emerald-300"}`}
              >
                <span className="font-semibold text-slate-900">Chuyển khoản QR</span>
                <span className="text-sm text-slate-500">Quét mã VietQR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                disabled={Boolean(createdOrder)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                  paymentMethod === "cod" ? "border-orange-500 bg-orange-50" : "border-slate-200"
                } ${createdOrder ? "cursor-not-allowed opacity-60" : "hover:border-orange-300"}`}
              >
                <span className="font-semibold text-slate-900">Thanh toán khi nhận hàng</span>
                <span className="text-sm text-slate-500">COD</span>
              </button>
            </div>
          </div>

          {paymentMethod === "qr" && createdOrder ? (
            <div className="space-y-4">
              <PaymentQR amount={createdOrder.finalAmount} orderCode={createdOrder.orderCode} />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/don-hang/${createdOrder.id}`)}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Xem chi tiết đơn hàng
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-slate-900">Tóm tắt đơn hàng</h2>

            {createdOrder ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mã đơn</span>
                  <span className="font-semibold text-slate-900">{createdOrder.orderCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trạng thái</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {createdOrder.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Thanh toán</span>
                  <span className="font-semibold text-slate-900">
                    {createdOrder.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {displayItems.map((item) => (
                  <div key={item.productId} className="flex justify-between py-2 text-sm">
                    <span className="pr-3 text-slate-600">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatVnd(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-bold">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatVnd(createdOrder?.finalAmount ?? finalAmount)}</span>
            </div>
          </div>

          {!createdOrder ? (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={loading || submitted}
              className="w-full rounded-2xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : `Xác nhận thanh toán ${formatVnd(finalAmount)}`}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
