import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPageClean() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900">Liên hệ TechStore</h1>
          <p className="mt-3 text-slate-600">
            Gửi câu hỏi về sản phẩm, đơn hàng hoặc bảo hành. Đội ngũ tư vấn sẽ phản
            hồi trong giờ làm việc.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <h2 className="text-xl font-semibold">Thông tin hỗ trợ</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Ưu tiên hỗ trợ đơn hàng online, kiểm tra tồn kho và tư vấn chọn máy theo
              nhu cầu thực tế.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
                <span>70 Lữ Gia, Quận 11, TP.HCM</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0" />
                <span>1900 2345</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                <span>support@techstore.vn</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Họ và tên
                </label>
                <input placeholder="Nguyễn Văn A" className="input" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input type="email" placeholder="ban@example.com" className="input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <input placeholder="09xxxxxxxx" className="input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nội dung
                </label>
                <textarea
                  placeholder="Mô tả câu hỏi của bạn để TechStore hỗ trợ nhanh hơn."
                  className="input min-h-[160px] resize-y"
                />
              </div>
            </div>

            <button className="btn-primary mt-6 w-full py-3 text-base">Gửi liên hệ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
