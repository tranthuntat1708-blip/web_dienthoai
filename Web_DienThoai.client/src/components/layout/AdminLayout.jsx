import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, FileText, MessageSquare, TicketPercent, CalendarDays, LogOut, Store, Layers3, Megaphone } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const adminLinks = [
  { to: "/admin", end: true, label: "Tổng quan", icon: LayoutDashboard },
  { to: "/admin/san-pham", label: "Sản phẩm", icon: Package },
  { to: "/admin/danh-muc", label: "Danh mục", icon: Layers3 },
  { to: "/admin/trang-chu", label: "Trang chủ", icon: Megaphone },
  { to: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingBag },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/danh-gia", label: "Đánh giá", icon: MessageSquare },
  { to: "/admin/khuyen-mai", label: "Khuyến mãi", icon: TicketPercent },
  { to: "/admin/lich-hen", label: "Lịch hẹn", icon: CalendarDays },
];

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Toaster position="top-right" />

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-slate-950 px-5 py-6 text-white">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
              TechStore Admin
            </p>
            <h1 className="mt-2 text-2xl font-black">Bảng điều khiển</h1>
            <p className="mt-2 text-sm text-slate-400">
              Quản lý sản phẩm, đơn hàng và nội dung từ một nơi.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Đang đăng nhập</p>
            <p className="mt-2 font-semibold text-white">{user?.fullName || user?.email}</p>
            <p className="text-sm text-slate-400">{user?.role || "Admin"}</p>
          </div>

          <nav className="space-y-2">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Store size={18} />
              Về storefront
            </NavLink>

            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
            <p className="text-sm text-slate-500">Khu quản trị được tách riêng khỏi giao diện khách hàng.</p>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
