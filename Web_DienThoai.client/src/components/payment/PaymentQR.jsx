import { formatVnd } from "../../utils/format";

export default function PaymentQR({ amount, orderCode }) {
  const bank = "MB";
  const account = "123456789";
  const accountName = "TECHSTORE";
  const transferContent = `Thanh toan ${orderCode}`;

  const qrUrl = `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent,
  )}&accountName=${encodeURIComponent(accountName)}`;

  async function copyTransferContent() {
    try {
      await navigator.clipboard.writeText(transferContent);
    } catch {
      // no-op
    }
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Thanh toán QR
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Quét mã để hoàn tất thanh toán
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sau khi chuyển khoản, cửa hàng sẽ xác nhận giao dịch và cập nhật trạng thái thanh toán cho đơn hàng.
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {formatVnd(amount)}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <img
            src={qrUrl}
            alt={`QR thanh toán cho ${orderCode}`}
            className="mx-auto h-48 w-48"
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Mã đơn hàng
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{orderCode}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Nội dung chuyển khoản
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-900">
              {transferContent}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tài khoản nhận
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {bank} - {account}
            </p>
            <p className="text-sm font-semibold text-slate-900">{accountName}</p>
          </div>

          <button
            type="button"
            onClick={copyTransferContent}
            className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sao chép nội dung chuyển khoản
          </button>

          <p className="text-xs leading-5 text-slate-500">
            Lưu ý: mã QR này là chuyển khoản VietQR thủ công. Hệ thống chưa tự động xác nhận thanh toán như luồng VNPay.
          </p>
        </div>
      </div>
    </div>
  );
}
