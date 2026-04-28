import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import MobileMenu from "./MobileMenu";

export default function HeaderMinimal() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items || []);
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  useEffect(() => {
    if (!menuOpen) return;
    setSearchOpen(false);
    setProfileOpen(false);
  }, [menuOpen]);

  function onSearch(event) {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    navigate(`/danh-muc?q=${encodeURIComponent(value)}`);
    setSearchOpen(false);
  }

  function onLogout() {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600" />
          <div>
            <p className="text-sm font-bold leading-none text-slate-900">TechStore</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">Mobile</p>
          </div>
        </Link>

          <form
            onSubmit={onSearch}
            className="mx-2 hidden flex-1 items-center rounded-xl bg-slate-100 px-3 md:flex"
          >
            <Search size={14} className="text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-700 outline-none"
            />
          </form>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((value) => !value);
              setMenuOpen(false);
            }}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Mở tìm kiếm"
          >
            <Search size={18} />
          </button>

          <Link to="/gio-hang" className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100">
            <ShoppingCart size={18} />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((value) => !value);
                  setMenuOpen(false);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
              >
                {(user?.fullName || user?.email || "U").slice(0, 1).toUpperCase()}
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <Link
                    to="/tai-khoan"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Tài khoản
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/dang-nhap" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
              Đăng nhập
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 active:scale-[0.98] md:hidden"
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  menuOpen ? "translate-y-1 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3.5 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                  menuOpen ? "-translate-y-1 rotate-[-45deg]" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-slate-100 bg-white p-3 md:hidden">
          <form onSubmit={onSearch} className="mx-auto flex max-w-xl">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="flex-1 rounded-l-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none"
            />
            <button className="rounded-r-xl bg-blue-600 px-4 text-sm font-semibold text-white">Tìm</button>
          </form>
        </div>
      ) : null}

      <MobileMenu
        open={menuOpen}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
    </header>
  );
}
