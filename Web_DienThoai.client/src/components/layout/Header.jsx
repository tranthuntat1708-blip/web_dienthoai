import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
  ClipboardList,
} from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCategoriesStore } from "../../store/categoriesStore";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/danh-muc", label: "Sản phẩm", hasDropdown: true },
  { to: "/bo-suu-tap", label: "Nổi bật" },
  { to: "/chinh-sach", label: "Chính sách" },
  { to: "/blog", label: "Tin tức" },
  { to: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items || []);
  const totalItems = items.reduce((s, i) => s + (i.quantity || 0), 0);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const wishlistIds = useWishlistStore((s) => s.ids || []);
  const fetchWishlistIfNeeded = useWishlistStore((s) => s.fetchIfNeeded);
  const resetWishlist = useWishlistStore((s) => s.reset);

  const { categories, fetchIfEmpty } = useCategoriesStore();

  useEffect(() => {
    fetchIfEmpty();
  }, [fetchIfEmpty]);

  useEffect(() => {
    if (user) fetchWishlistIfNeeded();
    else resetWishlist();
  }, [user, fetchWishlistIfNeeded, resetWishlist]);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const quickCategories = safeCategories.slice(0, 6);

  function handleSearch(e) {
    e.preventDefault();
    const keyword = searchVal.trim();
    if (!keyword) return;

    navigate(`/danh-muc?q=${encodeURIComponent(keyword)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <>
      <div className="hidden border-b border-slate-800 bg-[#020617] text-slate-300 md:block">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <span className="inline-flex items-center gap-2">
            <Phone size={12} />
            Hotline: <strong className="text-blue-400">1900 2345</strong>
            <span className="text-slate-500">·</span>
            Miễn phí giao hàng từ 500.000đ
          </span>

          <div className="flex items-center gap-4">
            <Link to="/dat-lich" className="hover:text-blue-400">
              Đặt lịch tư vấn
            </Link>
            <Link to="/tra-cuu-don-hang" className="hover:text-blue-400">
              Tra cứu đơn hàng
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="mr-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
              📱
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-blue-600">TechStore</span>
              <span className="block text-[10px] text-slate-400">Mobile & Accessories</span>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <div key={item.to} className="group relative">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                  {item.hasDropdown ? <ChevronDown size={12} /> : null}
                </NavLink>

                {item.hasDropdown && quickCategories.length > 0 ? (
                  <div className="invisible absolute top-full z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    {quickCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/danh-muc?category=${cat.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden xl:flex xl:w-64 xl:items-center xl:rounded-xl xl:border xl:border-slate-200 xl:bg-slate-50 xl:px-3"
          >
            <Search size={14} className="text-slate-400" />
            <input
              value={searchVal}
              onChange={(event) => setSearchVal(event.target.value)}
              placeholder="Tìm iPhone, Samsung..."
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              to="/tra-cuu-don-hang"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:inline-flex"
            >
              <ClipboardList size={14} />
              Tra cứu đơn
            </Link>

            <button
              onClick={() => {
                setSearchOpen((value) => !value);
                setProfileOpen(false);
              }}
              className="rounded-full p-2 transition hover:bg-slate-100 xl:hidden"
              aria-label="Mở tìm kiếm"
            >
              <Search size={18} />
            </button>

            <Link to="/yeu-thich" className="relative rounded-full p-2 transition hover:bg-slate-100">
              <Heart size={18} />
              {wishlistIds.length > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] text-white shadow">
                  {wishlistIds.length}
                </span>
              ) : null}
            </Link>

            <Link to="/gio-hang" className="relative rounded-full p-2 transition hover:bg-slate-100">
              <ShoppingCart size={18} />
              {totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 text-[10px] text-white shadow">
                  {totalItems}
                </span>
              ) : null}
            </Link>

            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setProfileOpen((value) => !value);
                    setSearchOpen(false);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-slate-900 to-slate-700 text-sm font-bold text-white shadow"
                >
                  {(user?.fullName || user?.email || "U").slice(0, 1).toUpperCase()}
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    <Link
                      to="/tai-khoan"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/tai-khoan/don-hang"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Lịch sử đơn hàng
                    </Link>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        Vào khu quản trị
                      </Link>
                    ) : null}
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
              >
                Đăng nhập
              </Link>
            )}

            <button
              className="p-2 lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Mở menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="animate-fade-in border-t border-slate-100 bg-white p-3 xl:hidden">
            <form onSubmit={handleSearch} className="mx-auto flex max-w-lg shadow-sm">
              <input
                value={searchVal}
                onChange={(event) => setSearchVal(event.target.value)}
                placeholder="Tìm iPhone, Samsung, phụ kiện..."
                className="flex-1 rounded-l-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
              />
              <button className="rounded-r-xl bg-blue-600 px-4 text-sm font-semibold text-white">
                Tìm
              </button>
            </form>
          </div>
        ) : null}

        {menuOpen ? (
          <div className="animate-fade-in space-y-2 border-t border-slate-100 bg-white p-4 lg:hidden">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg py-2 text-slate-700 transition hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-slate-200" />

            <Link
              to="/tra-cuu-don-hang"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg py-2 font-medium text-slate-700 transition hover:text-blue-700"
            >
              Tra cứu đơn hàng
            </Link>
            {user ? (
              <Link
                to="/tai-khoan"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg py-2 text-slate-700 transition hover:text-blue-700"
              >
                Tài khoản
              </Link>
            ) : (
              <Link
                to="/dang-nhap"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg py-2 font-medium text-blue-700"
              >
                Đăng nhập
              </Link>
            )}
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg py-2 font-semibold text-blue-700"
              >
                Vào khu quản trị
              </Link>
            ) : null}
            {user ? (
              <button
                onClick={handleLogout}
                className="block rounded-lg py-2 text-left font-semibold text-red-600"
              >
                Đăng xuất
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
    </>
  );
}
