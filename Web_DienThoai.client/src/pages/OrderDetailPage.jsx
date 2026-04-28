import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { orderApi } from "../api/orders";
import { formatDate, formatVnd } from "../utils/format";
import { resolveImage } from "../utils/imageResolver";
import { getOrderStatusMeta, getPaymentMethodLabel } from "../utils/orderPresentation";

const STATUS_STEPS = [
  { key: "Pending", label: "Đã đặt hàng" },
  { key: "Processing", label: "Đã xác nhận" },
  { key: "Shipping", label: "Đang giao hàng" },
  { key: "Completed", label: "Hoàn tất" },
];


function getProgressWidth(currentStepIndex, orderStatus) {
  if (orderStatus === "Cancelled" || orderStatus === "Refunded") return "0%";
  if (currentStepIndex < 0) return "0%";
  if (currentStepIndex >= STATUS_STEPS.length - 1) return "100%";
  return `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        setLoading(true);
        setError("");
        const data = await orderApi.getOrder(Number(id));
        if (isMounted) {
          setOrder(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError?.response?.data?.message ?? "Không thể tải chi tiết đơn hàng.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const statusMeta = order ? getOrderStatusMeta(order.status) : getOrderStatusMeta("Pending");

  const currentStepIndex = useMemo(() => {
    if (!order) return -1;
    if (order.status === "Cancelled" || order.status === "Refunded") return -1;
    return STATUS_STEPS.findIndex((step) => step.key === order.status);
  }, [order]);

  const trackingMoments = useMemo(() => {
    if (!order) return [];

    const moments = [
      {
        title: "Đơn hàng được tạo",
        description: "Hệ thống đã ghi nhận đơn và chờ xác nhận từ cửa hàng.",
        active: true,
      },
      {
        title: "Cửa hàng xác nhận",
        description: "Đơn được kiểm tra tồn kho, đóng gói và chuẩn bị xử lý.",
        active: currentStepIndex >= 1,
      },
      {
        title: "Bàn giao đơn vị vận chuyển",
        description: "Kiện hàng đã được xuất kho và chuyển sang trạng thái giao hàng.",
        active: currentStepIndex >= 2,
      },
      {
        title: "Giao hàng thành công",
        description: "Đơn đã hoàn tất và sẵn sàng cho hậu mãi hoặc đổi trả nếu cần.",
        active: currentStepIndex >= 3,
      },
    ];

    if (order.status === "Cancelled" || order.status === "Refunded") {
      moments.push({
        title: statusMeta.label,
        description:
          order.status === "Refunded"
            ? "Khoản thanh toán đã được hoàn về phương thức thanh toán phù hợp."
            : "Đơn hàng đã được dừng xử lý theo trạng thái hiện tại.",
        active: true,
      });
    }

    return moments;
  }, [currentStepIndex, order, statusMeta.label]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy đơn hàng</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "Đơn hàng không tồn tại hoặc bạn không có quyền xem."}</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Chi tiết đơn hàng
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{order.orderCode}</h1>
          <p className="mt-2 text-sm text-slate-500">Đặt ngày {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusMeta.tone}`}>
            {statusMeta.label}
          </span>
          <span className="text-sm text-slate-500">
            {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
        </div>
      </div>

      {(order.status === "Cancelled" || order.status === "Refunded") ? (
        <div className="mb-6 rounded-3xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">
          Đơn hàng này hiện ở trạng thái <b>{statusMeta.label}</b>. Nếu cần hỗ trợ thêm, bạn có thể liên hệ bộ phận chăm sóc khách hàng.
        </div>
      ) : (
        <div className="mb-6 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Theo dõi đơn hàng trực quan</h2>
              <p className="mt-1 text-sm text-slate-500">
                Bạn có thể nhìn nhanh đơn hàng đang ở bước nào và còn gì phía trước.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {Math.max(currentStepIndex + 1, 1)}/{STATUS_STEPS.length} chặng
            </span>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
              style={{ width: getProgressWidth(currentStepIndex, order.status) }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {STATUS_STEPS.map((step, index) => {
              const active = index <= currentStepIndex;
              return (
                <div
                  key={step.key}
                  className={`relative rounded-2xl border p-4 ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500"}`}>
                    {index + 1}
                  </div>
                  <p className={`font-semibold ${active ? "text-white" : "text-slate-500"}`}>{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Sản phẩm trong đơn</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.productName}`} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
                  <img
                    src={resolveImage(item.mainImageUrl)}
                    alt={item.productName}
                    className="h-20 w-20 rounded-2xl bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span>Số lượng: {item.quantity}</span>
                      <span>Đơn giá: {formatVnd(item.unitPrice)}</span>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-slate-900">
                    {formatVnd(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Nhật ký xử lý</h2>
            <div className="space-y-4">
              {trackingMoments.map((moment, index) => (
                <div key={moment.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                        moment.active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < trackingMoments.length - 1 ? (
                      <div className={`mt-2 h-full w-0.5 ${moment.active ? "bg-emerald-200" : "bg-slate-100"}`} />
                    ) : null}
                  </div>
                  <div className="pb-4">
                    <p className={`font-semibold ${moment.active ? "text-slate-900" : "text-slate-500"}`}>
                      {moment.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{moment.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Thông tin nhận hàng</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Người nhận</p>
                <p className="mt-1 font-semibold text-slate-900">{order.receiverName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Số điện thoại</p>
                <p className="mt-1 font-semibold text-slate-900">{order.receiverPhone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Địa chỉ</p>
                <p className="mt-1 leading-6 text-slate-900">{order.receiverAddress}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Thanh toán</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span>Tạm tính</span>
                <span className="font-medium text-slate-900">{formatVnd(order.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Giảm giá</span>
                <span className="font-medium text-slate-900">{formatVnd(order.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-base font-bold text-slate-900">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{formatVnd(order.finalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Phương thức</span>
                <span className="font-medium text-slate-900">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Trạng thái thanh toán</span>
                <span className="font-medium text-slate-900">
                  {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
              {order.vnpayTransactionId ? (
                <div className="flex items-center justify-between text-slate-500">
                  <span>Mã giao dịch</span>
                  <span className="font-medium text-slate-900">{order.vnpayTransactionId}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
