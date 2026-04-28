import { useLocation, useNavigate } from "react-router-dom";

import { formatVnd } from "../utils/format";

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId;
  const orderCode = state?.orderCode ?? (orderId ? `#${orderId}` : "N/A");
  const amount = state?.amount || 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Đặt hàng thành công</h1>

        <p className="text-slate-500">
          Mã đơn hàng: <b className="text-slate-900">{orderCode}</b>
        </p>

        <p className="text-slate-500">
          Tổng thanh toán: <b className="text-slate-900">{formatVnd(amount)}</b>
        </p>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700"
          >
            Trang chủ
          </button>

          <button
            type="button"
            onClick={() => orderId && navigate(`/don-hang/${orderId}`)}
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
