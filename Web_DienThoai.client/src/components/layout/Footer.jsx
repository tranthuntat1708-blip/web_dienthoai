import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
];

const supportLinks = [
  { to: "/dat-lich", label: "Liên hệ đặt lịch" },
  { to: "#", label: "Hỏi đáp" },
  { to: "/chinh-sach/doi-tra", label: "Chính sách đổi trả" },
  { to: "/chinh-sach/giao-hang", label: "Chính sách vận chuyển" },
  { to: "/tai-khoan/don-hang", label: "Tra cứu đơn hàng" },
  { to: "#", label: "Cảm ơn khách hàng" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#020617] to-black text-slate-400">
      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* BRAND */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
              📱
            </div>
            <div>
              <span className="block font-bold text-white text-base">
                TechStore
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-blue-400">
                Mobile & Technology
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed max-w-sm text-slate-500">
            TechStore – chuyên cung cấp smartphone, phụ kiện chính hãng với giá
            tốt. Cam kết sản phẩm chất lượng, bảo hành uy tín và trải nghiệm mua
            sắm hiện đại.
          </p>

          <div className="space-y-2 text-sm text-slate-500">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-blue-400" />
              <span>70 Lữ Gia, Q.11, TP. HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-400" />
              <span>1900 2345</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-blue-400" />
              <span>support@techstore.vn</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3 pt-2">
            {socialLinks.map(({ icon: Icon, href }) => (
              <a
                key={href + Icon.displayName}
                href={href}
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:scale-105"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">
            VỀ CHÚNG TÔI
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/dat-lich" className="hover:text-blue-400 transition">
                Hệ thống cửa hàng
              </Link>
            </li>
            <li>
              <Link to="/dat-lich" className="hover:text-blue-400 transition">
                Hệ thống đại lý
              </Link>
            </li>
            <li>
              <Link
                to="/chinh-sach/giao-hang"
                className="hover:text-blue-400 transition"
              >
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link
                to="/chinh-sach/doi-tra"
                className="hover:text-blue-400 transition"
              >
                Quy định hoàn tiền
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">HỖ TRỢ</h4>
          <ul className="space-y-3 text-sm">
            {supportLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-blue-400 transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SUBSCRIBE */}
        <div className="space-y-6">
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              ĐĂNG KÝ NHẬN TIN
            </h4>
            <p className="text-xs mb-3 text-slate-500">
              Nhận thông tin sản phẩm mới & khuyến mãi hot.
            </p>

            <form className="flex shadow-sm">
              <input
                placeholder="Nhập email..."
                className="flex-1 text-xs px-3 py-2.5 rounded-l-lg bg-slate-900 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button className="px-3 py-2.5 rounded-r-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition">
                <Mail size={15} />
              </button>
            </form>
          </div>

          {/* PAYMENT */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              THANH TOÁN
            </h4>
            <div className="flex flex-wrap gap-2">
              {["VNPAY", "Momo", "VISA", "ATM", "ZaloPay"].map((p) => (
                <span
                  key={p}
                  className="text-xs px-2.5 py-1.5 rounded-lg font-medium bg-slate-900 text-slate-300 border border-slate-700 hover:border-blue-500 hover:text-white transition"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© 2025 TechStore. All rights reserved.</span>

          <div className="flex items-center gap-3">
            <Link
              to="/chinh-sach/bao-mat"
              className="hover:text-blue-400 transition"
            >
              Chính sách bảo mật
            </Link>
            <span>·</span>
            <Link
              to="/chinh-sach/bao-mat"
              className="hover:text-blue-400 transition"
            >
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
