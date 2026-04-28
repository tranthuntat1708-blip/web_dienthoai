import { Link } from "react-router-dom";
import { BadgeHelp, RefreshCcw, ShieldCheck, Wrench } from "lucide-react";

const flows = [
  {
    icon: ShieldCheck,
    title: "Bảo hành chính hãng",
    description:
      "Áp dụng cho máy và phụ kiện đủ điều kiện với serial/IMEI rõ ràng. TechStore hỗ trợ kiểm tra đầu vào, hướng dẫn giấy tờ và theo dõi tiến độ xử lý.",
    steps: [
      "Chuẩn bị mã đơn hàng, serial/IMEI và mô tả lỗi.",
      "Gửi yêu cầu qua hotline, liên hệ hoặc tới cửa hàng.",
      "Nhận xác nhận tiếp nhận, thời gian dự kiến và phương án xử lý.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "Đổi trả và hoàn tiền",
    description:
      "Nếu giao sai phiên bản, lỗi kỹ thuật ban đầu hoặc thiếu phụ kiện, luồng đổi trả được rút gọn để khách dễ theo dõi hơn.",
    steps: [
      "Tra cứu đơn hoặc đăng nhập tài khoản để lấy thông tin đơn.",
      "Gửi hình ảnh hoặc video lỗi nếu có để rút ngắn thời gian xác minh.",
      "Nhận phương án đổi máy, đổi sản phẩm tương đương hoặc hoàn tiền.",
    ],
  },
  {
    icon: Wrench,
    title: "Hỗ trợ hậu mãi",
    description:
      "Bao gồm cập nhật tình trạng sửa chữa, hướng dẫn phụ kiện tương thích, thu cũ lên đời và tư vấn tối ưu sau mua.",
    steps: [
      "Mô tả nhu cầu cần hỗ trợ sau bán.",
      "TechStore phân loại: kỹ thuật, phụ kiện, đổi trả hay bảo hành.",
      "Theo dõi hướng xử lý tập trung thay vì liên hệ rời rạc nhiều nơi.",
    ],
  },
];

export default function AfterSalesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <BadgeHelp size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              Hậu mãi và bảo hành
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Rõ quy trình hơn sau khi khách đã mua hàng
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Trang này gom lại những gì người mua cần sau khi thanh toán: bảo hành, đổi trả,
              kiểm tra tình trạng và liên hệ hỗ trợ.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/tra-cuu-don-hang" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Tra cứu đơn hàng
          </Link>
          <Link to="/chinh-sach/doi-tra" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Xem chính sách đổi trả
          </Link>
          <Link to="/lien-he" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {flows.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                <Icon size={20} />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              <div className="mt-5 space-y-3">
                {item.steps.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
