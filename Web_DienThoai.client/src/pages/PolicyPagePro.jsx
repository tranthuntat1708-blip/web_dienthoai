import { Link, Navigate, useParams } from "react-router-dom";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const policies = {
  "giao-hang": {
    title: "Chính sách giao hàng",
    icon: Truck,
    intro:
      "TechStore ưu tiên xác nhận đơn nhanh, hiển thị trạng thái rõ ràng và giao đúng phiên bản sản phẩm.",
    bullets: [
      "TP.HCM và thành phố lớn: 1 - 2 ngày làm việc.",
      "Các tỉnh/thành khác: 3 - 5 ngày làm việc.",
      "Miễn phí giao hàng cho đơn từ 500.000đ.",
      "Hàng đặt trước sẽ có lịch giao riêng được thông báo minh bạch.",
    ],
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    icon: RotateCcw,
    intro:
      "Nếu sản phẩm lỗi kỹ thuật, giao sai mẫu hoặc sai dung lượng, TechStore hỗ trợ xử lý nhanh và rõ quy trình.",
    bullets: [
      "Đổi/trả trong 7 ngày với lỗi từ nhà sản xuất hoặc giao sai thông tin.",
      "Sản phẩm cần còn serial/IMEI và không hư hỏng do tác động từ người dùng.",
      "Hoàn tiền qua chuyển khoản trong 3 - 5 ngày làm việc sau khi duyệt.",
      "Sản phẩm chính hãng vẫn áp dụng chính sách bảo hành của hãng.",
    ],
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    icon: ShieldCheck,
    intro:
      "TechStore cam kết chỉ sử dụng dữ liệu cần thiết để xử lý đơn hàng và chăm sóc khách hàng.",
    bullets: [
      "Thu thập thông tin phục vụ thanh toán, giao hàng và hậu mãi.",
      "Không bán dữ liệu cá nhân cho bên thứ ba.",
      "Chỉ chia sẻ thông tin với đối tác vận chuyển/thanh toán khi cần hoàn tất giao dịch.",
      "Người dùng có quyền yêu cầu cập nhật thông tin tài khoản bất cứ lúc nào.",
    ],
  },
};

export default function PolicyPagePro() {
  const { type } = useParams();

  if (!type || !policies[type]) return <Navigate to="/chinh-sach/giao-hang" replace />;

  const current = policies[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fbff_0%,_#ffffff_45%,_#eef4ff_100%)] py-12">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="px-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Chính sách
          </h2>
          <div className="mt-3 space-y-2">
            {Object.keys(policies).map((key) => (
              <Link
                key={key}
                to={`/chinh-sach/${key}`}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  key === type
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                }`}
              >
                {policies[key].title}
              </Link>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-white">
              <Icon size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                {current.title}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
                {current.intro}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {current.bullets.map((item, index) => (
              <article key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Mục {index + 1}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
