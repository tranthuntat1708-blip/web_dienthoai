import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleUserRound,
  FileText,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  PackageSearch,
  PhoneCall,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const DRAWER_WIDTH = 360;
const DRAG_CLOSE_THRESHOLD = 80;
const SWIPE_OPEN_THRESHOLD = 55;

function MenuItem({ to, icon: Icon, label, active, onSelect, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000, duration: 0.24, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={to}
        onClick={onSelect}
        className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ease-in-out hover:bg-slate-100 ${
          active ? "bg-blue-50 text-blue-700" : "text-slate-700"
        }`}
      >
        <Icon size={17} className={active ? "text-blue-600" : "text-slate-400"} />
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export default function MobileMenu({
  open,
  onOpen,
  onClose,
  user,
  isAdmin,
  onLogout,
}) {
  const location = useLocation();
  const panelRef = useRef(null);
  const edgeTouchStartX = useRef(null);

  const mainItems = useMemo(
    () => [
      { to: "/", icon: Home, label: "Trang chủ" },
      { to: "/danh-muc", icon: ShoppingBag, label: "Sản phẩm" },
      { to: "/bo-suu-tap", icon: Sparkles, label: "Nổi bật" },
    ],
    [],
  );

  const secondaryItems = useMemo(
    () => [
      { to: "/chinh-sach/giao-hang", icon: FileText, label: "Chính sách" },
      { to: "/tra-cuu-don-hang", icon: PackageSearch, label: "Tra cứu đơn" },
      { to: "/lien-he", icon: PhoneCall, label: "Liên hệ" },
    ],
    [],
  );

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    localStorage.setItem("mobile_menu_last_open", "1");

    const timer = window.setTimeout(() => {
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables?.length) focusables[0].focus();
    }, 20);

    function onKeyDown(event) {
      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      localStorage.setItem("mobile_menu_last_open", "0");
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    function onResize() {
      if (window.innerWidth >= 768) onClose();
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const menuNode = (
    <>
      {!open ? (
        <div
          className="fixed inset-y-0 left-0 z-[118] w-4 md:hidden"
          aria-hidden
          onTouchStart={(event) => {
            edgeTouchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchMove={(event) => {
            if (edgeTouchStartX.current == null || open) return;
            const currentX = event.touches[0]?.clientX ?? edgeTouchStartX.current;
            if (currentX - edgeTouchStartX.current > SWIPE_OPEN_THRESHOLD) {
              onOpen?.();
              edgeTouchStartX.current = null;
            }
          }}
          onTouchEnd={() => {
            edgeTouchStartX.current = null;
          }}
        />
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[120] md:hidden"
            aria-hidden={!open}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              aria-label="Đóng menu"
              className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
              onClick={onClose}
              whileTap={{ opacity: 0.35 }}
            />

            <motion.aside
              id="mobile-menu"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng di động"
              drag="x"
              dragDirectionLock
              dragElastic={0.08}
              dragConstraints={{ left: -DRAWER_WIDTH, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -DRAG_CLOSE_THRESHOLD || info.velocity.x < -500) {
                  onClose();
                }
              }}
              initial={{ x: -DRAWER_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -DRAWER_WIDTH }}
              transition={{ type: "spring", stiffness: 360, damping: 34, mass: 0.9 }}
              className="absolute inset-y-0 left-0 flex w-full max-w-[100vw] flex-col rounded-r-3xl bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.22)]"
            >
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {(user?.fullName || user?.email || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName || "Khách"}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email || "Chưa đăng nhập"}</p>
                  </div>
                </div>
              </div>

              <nav className="mt-4 space-y-5">
                <section>
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Chính</p>
                  <div className="mt-2 space-y-1">
                    {mainItems.map((item, index) => (
                      <MenuItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.to}
                        onSelect={onClose}
                        delay={index * 35}
                      />
                    ))}
                  </div>
                </section>

                <div className="h-px bg-slate-200" />

                <section>
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Khác</p>
                  <div className="mt-2 space-y-1">
                    {secondaryItems.map((item, index) => (
                      <MenuItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname.startsWith(item.to)}
                        onSelect={onClose}
                        delay={95 + index * 35}
                      />
                    ))}
                  </div>
                </section>
              </nav>

              <div className="mt-auto space-y-3 pt-4">
                <div className="h-px bg-slate-200" />
                {user ? (
                  <>
                    <MenuItem
                      to="/tai-khoan"
                      icon={CircleUserRound}
                      label="Tài khoản"
                      active={location.pathname.startsWith("/tai-khoan")}
                      onSelect={onClose}
                      delay={160}
                    />
                    <MenuItem
                      to="/yeu-thich"
                      icon={Heart}
                      label="Yêu thích"
                      active={location.pathname.startsWith("/yeu-thich")}
                      onSelect={onClose}
                      delay={190}
                    />

                    {isAdmin ? (
                      <MenuItem
                        to="/admin"
                        icon={LayoutDashboard}
                        label="Quản trị"
                        active={location.pathname.startsWith("/admin")}
                        onSelect={onClose}
                        delay={220}
                      />
                    ) : null}

                    <motion.button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition duration-200 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </motion.button>
                  </>
                ) : (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/dang-nhap"
                      onClick={onClose}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700"
                    >
                      <LogIn size={16} />
                      Đăng nhập
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  return createPortal(menuNode, document.body);
}
