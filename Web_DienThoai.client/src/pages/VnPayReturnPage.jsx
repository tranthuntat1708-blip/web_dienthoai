import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { formatVnd } from "../utils/format";

export default function VnPayReturnPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  const responseCode = searchParams.get("vnp_ResponseCode");
  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");
  const transactionNo = searchParams.get("vnp_TransactionNo");

  useEffect(() => {
    setStatus(responseCode === "00" ? "success" : "failed");
  }, [responseCode]);

  const formattedAmount = amount ? formatVnd(Number(amount) / 100) : "";

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="mt-4 text-gray-500">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 px-4">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 text-center shadow-xl">
        {status === "success" ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán thành công</h1>
            <p className="text-gray-500">Cảm ơn bạn đã mua hàng tại TechStore.</p>
            <div className="space-y-2 rounded-2xl bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-semibold text-gray-900">{txnRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền</span>
                <span className="font-semibold text-amber-600">{formattedAmount}</span>
              </div>
              {transactionNo ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã giao dịch VNPay</span>
                  <span className="font-mono text-gray-900">{transactionNo}</span>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán thất bại</h1>
            <p className="text-gray-500">
              Giao dịch chưa hoàn tất. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            {txnRef ? (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <span className="font-semibold text-gray-900">{txnRef}</span>
                </div>
              </div>
            ) : null}
          </>
        )}

        <div className="flex gap-3 pt-2">
          <Link to="/" className="flex-1 rounded-xl bg-slate-900 py-3 text-center font-semibold text-white">
            Về trang chủ
          </Link>
          <Link
            to="/"
            className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
