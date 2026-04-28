import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";

import { orderApi } from "../api/orders";
import { formatVnd } from "../utils/format";
import { getOrderStatusLabel, getPaymentMethodLabel } from "../utils/orderPresentation";

export default function GuestOrderLookupPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ orderCode: "", phone: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "orderCode") {
      setForm((current) => ({ ...current, orderCode: value.toUpperCase().trimStart() }));
      return;
    }
    if (name === "phone") {
      const digitsOnly = value.replace(/[^\d]/g, "");
      setForm((current) => ({ ...current, phone: digitsOnly }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function performLookup(orderCode, phone) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await orderApi.lookupGuestOrder(orderCode.trim(), phone.trim());
      setResult(data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Không tìm thấy đơn hàng phù hợp.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await performLookup(form.orderCode, form.phone);
  }

  useEffect(() => {
    const orderCodeFromUrl = (searchParams.get("orderCode") || "").toUpperCase().trim();
    const phoneFromUrl = (searchParams.get("phone") || "").replace(/[^\d]/g, "");
    if (!orderCodeFromUrl || !phoneFromUrl) return;

    setForm({ orderCode: orderCodeFromUrl, phone: phoneFromUrl });
    performLookup(orderCodeFromUrl, phoneFromUrl);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <Search size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              Tra cứu đơn hàng
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Dành cho khách chưa đăng nhập
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Nhập mã đơn hàng và số điện thoại nhận hàng để kiểm tra tình trạng xử lý, thanh toán và giao hàng.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input name="orderCode" value={form.orderCode} onChange={handleChange} placeholder="Ví dụ: ORD-20260401-1234" className="input" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại nhận hàng" className="input" />
          <button type="submit" disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {loading ? "Đang tra cứu..." : "Tra cứu"}
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          Mẹo: bạn có thể nhập mã đơn không phân biệt chữ hoa/thường, hệ thống sẽ tự chuẩn hóa giúp bạn.
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </section>

      {result ? (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={20} />
            <h2 className="text-xl font-black text-slate-950">Kết quả tra cứu</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Mã đơn</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{result.orderCode}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Trạng thái</p>
              <p className="mt-1 text-lg font-bold text-slate-950">{getOrderStatusLabel(result.status)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Người nhận</p>
              <p className="mt-1 font-semibold text-slate-950">{result.receiverName}</p>
              <p className="text-sm text-slate-500">{result.receiverPhone}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Thanh toán</p>
              <p className="mt-1 font-semibold text-slate-950">{getPaymentMethodLabel(result.paymentMethod)}</p>
              <p className="text-sm text-slate-500">{result.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Địa chỉ giao hàng</p>
            <p className="mt-1 text-slate-900">{result.receiverAddress}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-950">Sản phẩm trong đơn</p>
              <p className="text-lg font-black text-blue-600">{formatVnd(result.finalAmount)}</p>
            </div>
            <div className="mt-4 space-y-3">
              {result.items?.map((item) => (
                <div key={`${item.productId}-${item.productName}`} className="flex items-center justify-between text-sm">
                  <span className="pr-4 text-slate-600">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">{formatVnd(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
