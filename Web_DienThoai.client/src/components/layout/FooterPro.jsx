/*
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, Truck, CreditCard } from "lucide-react";

const shopLinks = [
  { to: "/danh-muc", label: "Điện thoại" },
  { to: "/danh-muc?productType=audio", label: "Tai nghe" },
  { to: "/danh-muc?productType=tablet", label: "Tablet" },
  { to: "/danh-muc?productType=accessory", label: "Phụ kiện" },
];

const supportLinks = [
  { to: "/dat-lich", label: "Đặt lịch tư vấn" },
  { to: "/lien-he", label: "Liên hệ hỗ trợ" },
  { to: "/blog", label: "Tin tức công nghệ" },
  { to: "/yeu-thich", label: "Danh sách yêu thích" },
];

const policyLinks = [
  { to: "/chinh-sach/giao-hang", label: "Giao hàng" },
  { to: "/chinh-sach/doi-tra", label: "Đổi trả" },
  { to: "/chinh-sach/bao-mat", label: "Bảo mật" },
  { to: "/chinh-sach", label: "Tổng quan chính sách" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Chính hãng, bảo hành rõ ràng" },
  { icon: Truck, label: "Giao nhanh toàn quốc" },
  { icon: CreditCard, label: "Thanh toán minh bạch" },
];

export default function FooterPro() {
  return (
    <footer className="bg-gradient-to-b from-[#020617] to-black text-slate-400">
      <div className="border-b border-slate-800">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 md:grid-cols-3">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-slate-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-xl text-white shadow-lg">
              📱
            </div>
            <div>
              <span className="block text-base font-bold text-white">TechStore</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-blue-400">
                Mobile & Accessories
              </span>
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-500">
            Cửa hàng chuyên điện thoại và phụ kiện với cách trình bày rõ ràng,
            chính sách minh bạch và trải nghiệm mua sắm gọn hơn cho người dùng.
          </p>

          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-blue-400" />
              <span>70 Lữ Gia, Quận 11, TP.HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-blue-400" />
              <span>1900 2345</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-blue-400" />
              <span>support@techstore.vn</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Mua Sắm
          </h4>
          <ul className="space-y-3 text-sm">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-blue-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Hỗ Trợ
          </h4>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-blue-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Chính Sách
            </h4>
            <ul className="space-y-3 text-sm">
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition hover:text-blue-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Thanh Toán
            </h4>
            <div className="flex flex-wrap gap-2">
              {["VNPAY", "VISA", "ATM", "COD"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 md:flex-row">
          <span>© 2026 TechStore. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link to="/chinh-sach/bao-mat" className="transition hover:text-blue-400">
              Chính sách bảo mật
            </Link>
            <span>·</span>
            <Link to="/chinh-sach/doi-tra" className="transition hover:text-blue-400">
              Điều khoản đổi trả
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
*/

import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, Truck, CreditCard } from "lucide-react";

const shopLinks = [
  { to: "/danh-muc", label: "Điện thoại" },
  { to: "/danh-muc?productType=audio", label: "Tai nghe" },
  { to: "/danh-muc?productType=tablet", label: "Tablet" },
  { to: "/danh-muc?productType=accessory", label: "Phụ kiện" },
];

const supportLinks = [
  { to: "/dat-lich", label: "Đặt lịch tư vấn" },
  { to: "/lien-he", label: "Liên hệ hỗ trợ" },
  { to: "/blog", label: "Tin tức công nghệ" },
  { to: "/yeu-thich", label: "Danh sách yêu thích" },
];

const policyLinks = [
  { to: "/chinh-sach/giao-hang", label: "Giao hàng" },
  { to: "/chinh-sach/doi-tra", label: "Đổi trả" },
  { to: "/chinh-sach/bao-mat", label: "Bảo mật" },
  { to: "/chinh-sach", label: "Tổng quan chính sách" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Chính hãng, bảo hành rõ ràng" },
  { icon: Truck, label: "Giao nhanh toàn quốc" },
  { icon: CreditCard, label: "Thanh toán minh bạch" },
];

export default function FooterPro() {
  return (
    <footer className="bg-gradient-to-b from-[#020617] to-black text-slate-400">
      <div className="border-b border-slate-800">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 md:grid-cols-3">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-slate-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-xl text-white shadow-lg">
              📱
            </div>
            <div>
              <span className="block text-base font-bold text-white">TechStore</span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-blue-400">
                Mobile & Accessories
              </span>
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-500">
            Cửa hàng chuyên điện thoại và phụ kiện với cách trình bày rõ ràng, chính sách minh bạch
            và trải nghiệm mua sắm gọn hơn cho người dùng.
          </p>

          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-blue-400" />
              <span>70 Lữ Gia, Quận 11, TP.HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-blue-400" />
              <span>1900 2345</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-blue-400" />
              <span>support@techstore.vn</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Mua sắm</h4>
          <ul className="space-y-3 text-sm">
            {shopLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-blue-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Hỗ trợ</h4>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-blue-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">Chính sách</h4>
            <ul className="space-y-3 text-sm">
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="transition hover:text-blue-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">Thanh toán</h4>
            <div className="flex flex-wrap gap-2">
              {["VNPAY", "VISA", "ATM", "COD"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 md:flex-row">
          <span>© 2026 TechStore. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <Link to="/chinh-sach/bao-mat" className="transition hover:text-blue-400">
              Chính sách bảo mật
            </Link>
            <span>·</span>
            <Link to="/chinh-sach/doi-tra" className="transition hover:text-blue-400">
              Điều khoản đổi trả
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
