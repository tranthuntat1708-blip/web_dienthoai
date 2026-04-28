import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

export default function HeaderProduction() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items || []);
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleSearch(event) {
    event.preventDefault();
    const keyword = searchVal.trim();
    if (!keyword) return;

    navigate(`/danh-muc?q=${encodeURIComponent(keyword)}`);
    setSearchOpen(false);
  }

  function handleLogout() {
    logout();
    setProfileOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow">
            📱
          </div>
          <div>
            <p className="font-bold leading-none text-blue-700">TechStore</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Mobile</p>
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-2 hidden flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex"
        >
          <Search size={14} className="text-slate-400" />
          <input
            value={searchVal}
            onChange={(event) => setSearchVal(event.target.value)}
            placeholder="Tìm sản phẩm, thương hiệu..."
            className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="rounded-full p-2 transition hover:bg-slate-100 md:hidden"
            aria-label="Mở tìm kiếm"
          >
            <Search size={18} />
          </button>

          <Link to="/gio-hang" className="relative rounded-full p-2 transition hover:bg-slate-100">
            <ShoppingCart size={18} />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 px-1.5 text-[10px] text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white"
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
            <Link to="/dang-nhap" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-slate-100 bg-white p-3 md:hidden">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl">
            <input
              value={searchVal}
              onChange={(event) => setSearchVal(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="flex-1 rounded-l-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
            />
            <button className="rounded-r-xl bg-blue-600 px-4 text-sm font-semibold text-white">Tìm</button>
          </form>
        </div>
      ) : null}
    </header>
  );
}

