import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

const contactPoints = [
  {
    icon: Phone,
    title: "Hotline bán hàng",
    value: "1900 2345",
    note: "Hỗ trợ từ 8:00 đến 22:00 mỗi ngày",
  },
  {
    icon: Mail,
    title: "Email hỗ trợ",
    value: "support@techstore.vn",
    note: "Phản hồi trong vòng 24 giờ làm việc",
  },
  {
    icon: MapPin,
    title: "Showroom",
    value: "70 Lữ Gia, Quận 11, TP.HCM",
    note: "Mở cửa 9:00 - 21:00",
  },
];

export default function ContactPagePro() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fbff_0%,_#ffffff_45%,_#eef4ff_100%)] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <MessageCircle size={12} />
              Liên hệ TechStore
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Cần tư vấn chọn sản phẩm, hỗ trợ đơn hàng hoặc hậu mãi? Gửi thông tin,
              đội ngũ TechStore sẽ phản hồi nhanh và rõ ràng.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {contactPoints.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-900 p-2 text-white">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{item.title}</p>
                      <p className="mt-1 text-base font-bold text-slate-950">{item.value}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Gửi yêu cầu hỗ trợ</h2>
            <p className="mt-2 text-sm text-slate-600">
              Điền thông tin để nhận phản hồi tư vấn từ đội ngũ CSKH.
            </p>

            <div className="mt-5 grid gap-4">
              <input placeholder="Họ và tên" className="input" />
              <input placeholder="Email" type="email" className="input" />
              <input placeholder="Số điện thoại" className="input" />
              <textarea placeholder="Nội dung cần hỗ trợ..." className="input h-28 resize-none" />

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <Send size={16} />
                Gửi liên hệ
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
