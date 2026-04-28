export const ORDER_STATUS_META = {
  Pending: { label: "Chờ xác nhận", tone: "bg-amber-100 text-amber-700" },
  Processing: { label: "Đang xử lý", tone: "bg-sky-100 text-sky-700" },
  Shipping: { label: "Đang giao", tone: "bg-indigo-100 text-indigo-700" },
  Completed: { label: "Hoàn thành", tone: "bg-emerald-100 text-emerald-700" },
  Cancelled: { label: "Đã hủy", tone: "bg-rose-100 text-rose-700" },
  Refunded: { label: "Đã hoàn tiền", tone: "bg-slate-200 text-slate-700" },
};

export const PAYMENT_METHOD_LABELS = {
  VNPay: "VNPay",
  QR: "Chuyển khoản QR",
  COD: "Thanh toán khi nhận hàng",
};

export function getOrderStatusMeta(status) {
  return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.Pending;
}

export function getOrderStatusLabel(status) {
  return getOrderStatusMeta(status).label;
}

export function getPaymentMethodLabel(method) {
  return PAYMENT_METHOD_LABELS[method] ?? method ?? "Đang cập nhật";
}
