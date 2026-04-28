/*
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Clock3, Eye, PackageSearch, RefreshCcw } from "lucide-react";

import { orderApi } from "../api/orders";
import ProductCard from "../components/product/ProductCard";
import { useAuthStore } from "../store/authStore";
import { useRecentlyViewedStore } from "../store/recentlyViewedStore";
import { formatVnd } from "../utils/format";
import { ORDER_STATUS_META, getOrderStatusMeta, getPaymentMethodLabel } from "../utils/orderPresentation";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const recentlyViewed = useRecentlyViewedStore((state) => state.items);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) return;

    orderApi
      .getMyOrders()
      .then((data) => setOrders(data ?? []))
      .finally(() => setLoading(false));
  }, [user]);

  const orderStats = useMemo(
    () => [
      { label: "Tổng đơn hàng", value: orders.length },
      {
        label: "Đang xử lý",
        value: orders.filter((item) => ["Pending", "Processing", "Shipping"].includes(item.status)).length,
      },
      { label: "Hoàn tất", value: orders.filter((item) => item.status === "Completed").length },
    ],
    [orders],
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }
    return orders.filter((item) => item.status === statusFilter);
  }, [orders, statusFilter]);

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({
        value,
        label: meta.label,
      })),
    ],
    [],
  );

  if (!user) {
    return <Navigate to="/dang-nhap" replace state={{ from: "/tai-khoan" }} />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              Tài khoản khách hàng
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Xin chào, {user.fullName || user.email}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Theo dõi lịch sử đơn hàng, mở lại sản phẩm đã xem và chuyển sang tra cứu hậu mãi khi cần.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/tra-cuu-don-hang" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              Tra cứu đơn khách vãng lai
            </Link>
            <Link to="/hau-mai" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Bảo hành và đổi trả
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {orderStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Lịch sử đơn hàng</h2>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi các đơn đã đặt, trạng thái xử lý và tổng thanh toán.
            </p>
          </div>
          <PackageSearch className="text-slate-300" size={24} />
        </div>

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Đang tải lịch sử đơn hàng...</p> : null}

          {!loading && orders.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-semibold text-slate-600">Lọc trạng thái:</span>
              {statusFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === option.value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              Bạn chưa có đơn hàng nào. Khi hoàn tất checkout, đơn sẽ xuất hiện tại đây.
            </div>
          ) : null}

          {!loading && orders.length > 0 && filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              Không có đơn hàng nào ở trạng thái đã chọn.
            </div>
          ) : null}

          {filteredOrders.map((order) => (
            <div key={order.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Mã đơn hàng</p>
                <p className="text-lg font-bold text-slate-950">{order.orderCode}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 size={14} />
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="space-y-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusMeta(order.status).tone}`}>
                  {getOrderStatusMeta(order.status).label}
                </span>
                <p className="text-sm text-slate-500">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-sm text-slate-500">Tổng thanh toán</p>
                <p className="text-xl font-black text-blue-600">{formatVnd(order.finalAmount)}</p>
              </div>

              <Link to={`/don-hang/${order.id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <Eye size={16} />
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Đã xem gần đây</h2>
            <p className="mt-1 text-sm text-slate-500">
              Giúp người dùng quay lại mẫu máy hoặc phụ kiện vừa cân nhắc mà không phải tìm lại từ đầu.
            </p>
          </div>
          <RefreshCcw className="text-slate-300" size={24} />
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Chưa có sản phẩm nào trong lịch sử xem gần đây.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {recentlyViewed.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
*/

import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Clock3, Eye, PackageSearch, RefreshCcw } from "lucide-react";

import { orderApi } from "../api/orders";
import ProductCard from "../components/product/ProductCard";
import { useAuthStore } from "../store/authStore";
import { useRecentlyViewedStore } from "../store/recentlyViewedStore";
import { formatVnd } from "../utils/format";
import { ORDER_STATUS_META, getOrderStatusMeta, getPaymentMethodLabel } from "../utils/orderPresentation";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const recentlyViewed = useRecentlyViewedStore((state) => state.items);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    orderApi.getMyOrders().then((data) => setOrders(data ?? [])).finally(() => setLoading(false));
  }, [user]);

  const orderStats = useMemo(
    () => [
      { label: "Tổng đơn hàng", value: orders.length },
      {
        label: "Đang xử lý",
        value: orders.filter((item) => ["Pending", "Processing", "Shipping"].includes(item.status)).length,
      },
      { label: "Hoàn tất", value: orders.filter((item) => item.status === "Completed").length },
    ],
    [orders],
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((item) => item.status === statusFilter);
  }, [orders, statusFilter]);

  const statusFilterOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...Object.entries(ORDER_STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
    ],
    [],
  );

  if (!user) return <Navigate to="/dang-nhap" replace state={{ from: "/tai-khoan" }} />;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Tài khoản khách hàng</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Xin chào, {user.fullName || user.email}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Theo dõi lịch sử đơn hàng, mở lại sản phẩm đã xem và chuyển sang tra cứu hậu mãi khi cần.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/tra-cuu-don-hang"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              Tra cứu đơn khách vãng lai
            </Link>
            <Link
              to="/hau-mai"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Bảo hành và đổi trả
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {orderStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Lịch sử đơn hàng</h2>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi các đơn đã đặt, trạng thái xử lý và tổng thanh toán.
            </p>
          </div>
          <PackageSearch className="text-slate-300" size={24} />
        </div>

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Đang tải lịch sử đơn hàng...</p> : null}

          {!loading && orders.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-semibold text-slate-600">Lọc trạng thái:</span>
              {statusFilterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    statusFilter === option.value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              Bạn chưa có đơn hàng nào. Khi hoàn tất checkout, đơn sẽ xuất hiện tại đây.
            </div>
          ) : null}

          {!loading && orders.length > 0 && filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              Không có đơn hàng nào ở trạng thái đã chọn.
            </div>
          ) : null}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Mã đơn hàng</p>
                <p className="text-lg font-bold text-slate-950">{order.orderCode}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 size={14} />
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="space-y-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getOrderStatusMeta(order.status).tone}`}>
                  {getOrderStatusMeta(order.status).label}
                </span>
                <p className="text-sm text-slate-500">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-sm text-slate-500">Tổng thanh toán</p>
                <p className="text-xl font-black text-blue-600">{formatVnd(order.finalAmount)}</p>
              </div>

              <Link
                to={`/don-hang/${order.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <Eye size={16} />
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">Đã xem gần đây</h2>
            <p className="mt-1 text-sm text-slate-500">
              Giúp bạn quay lại mẫu máy hoặc phụ kiện vừa cân nhắc mà không phải tìm lại từ đầu.
            </p>
          </div>
          <RefreshCcw className="text-slate-300" size={24} />
        </div>

        {recentlyViewed.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Chưa có sản phẩm nào trong lịch sử xem gần đây.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {recentlyViewed.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
