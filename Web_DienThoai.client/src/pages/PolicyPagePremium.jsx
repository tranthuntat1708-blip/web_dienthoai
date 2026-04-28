import { Link, Navigate, useParams } from "react-router-dom";
import { BadgeCheck, CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const POLICY_CONFIG = {
  "giao-hang": {
    title: "Chính sách giao hàng",
    subtitle: "Minh bạch về thời gian, phí vận chuyển và quy trình nhận hàng.",
    icon: Truck,
    highlights: [
      "Xử lý đơn trong 30 phút - 2 giờ làm việc.",
      "Miễn phí giao hàng cho đơn từ 500.000đ.",
      "Cập nhật trạng thái liên tục qua SMS/email.",
    ],
    sections: [
      {
        heading: "1. Khu vực và thời gian giao hàng",
        points: [
          "Nội thành TP.HCM: 1 - 2 ngày làm việc.",
          "Các thành phố lớn: 2 - 3 ngày làm việc.",
          "Khu vực tỉnh/huyện xa: 3 - 5 ngày làm việc.",
          "Đơn đặt trước hoặc sản phẩm hiếm sẽ có lịch riêng hiển thị tại trang sản phẩm.",
        ],
      },
      {
        heading: "2. Phí giao hàng",
        points: [
          "Đơn từ 500.000đ: miễn phí vận chuyển toàn quốc.",
          "Đơn dưới 500.000đ: phí hiển thị tại bước thanh toán theo địa chỉ nhận hàng.",
          "Không phát sinh phụ phí ngoài mức phí đã hiển thị trước khi đặt hàng.",
        ],
      },
      {
        heading: "3. Kiểm hàng khi nhận",
        points: [
          "Kiểm tra đúng model, màu, dung lượng và phụ kiện đi kèm trước khi ký nhận.",
          "Nếu có sai lệch, từ chối nhận và liên hệ hotline 1900 2345 để xử lý ngay.",
          "Đơn đã ký nhận được xem là đã nhận đúng hàng hóa cơ bản.",
        ],
      },
    ],
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    subtitle: "Rõ điều kiện, rõ thời hạn, rõ cách hoàn tiền.",
    icon: RotateCcw,
    highlights: [
      "Đổi/trả trong 7 ngày nếu lỗi NSX hoặc giao sai.",
      "Xử lý yêu cầu nhanh trong 24 giờ làm việc.",
      "Hoàn tiền 3 - 5 ngày làm việc sau khi duyệt.",
    ],
    sections: [
      {
        heading: "1. Điều kiện áp dụng đổi/trả",
        points: [
          "Sản phẩm lỗi kỹ thuật được xác nhận bởi trung tâm bảo hành/hệ thống kỹ thuật.",
          "Sản phẩm giao sai model, màu sắc, dung lượng hoặc thiếu phụ kiện tiêu chuẩn.",
          "Sản phẩm còn đủ hộp, phụ kiện, tem/IMEI và không có dấu hiệu rơi vỡ do người dùng.",
        ],
      },
      {
        heading: "2. Trường hợp không áp dụng",
        points: [
          "Hư hỏng do va đập, ngấm nước, tự ý sửa chữa hoặc can thiệp phần cứng/phần mềm.",
          "Thiếu phụ kiện, hộp hoặc chứng từ mua hàng quan trọng.",
          "Quá thời hạn đổi/trả được thông báo trên từng loại sản phẩm.",
        ],
      },
      {
        heading: "3. Hoàn tiền",
        points: [
          "Hoàn tiền qua phương thức thanh toán ban đầu hoặc chuyển khoản theo thông tin khách cung cấp.",
          "Thời gian xử lý: 3 - 5 ngày làm việc sau khi yêu cầu được phê duyệt.",
          "Phí phát sinh (nếu có) sẽ được thông báo minh bạch trước khi thực hiện.",
        ],
      },
    ],
  },
  "bao-hanh": {
    title: "Chính sách bảo hành",
    subtitle: "Bảo hành chính hãng và hậu mãi đồng hành xuyên suốt vòng đời sản phẩm.",
    icon: BadgeCheck,
    highlights: [
      "Bảo hành chính hãng theo IMEI/Serial.",
      "Hỗ trợ tiếp nhận tại cửa hàng hoặc qua vận chuyển.",
      "Theo dõi tiến độ xử lý bảo hành theo mã yêu cầu.",
    ],
    sections: [
      {
        heading: "1. Thời hạn bảo hành",
        points: [
          "Thời hạn bảo hành theo công bố của hãng/nhà phân phối chính thức.",
          "Thông tin bảo hành hiển thị rõ tại trang sản phẩm và hóa đơn.",
          "Một số phụ kiện có chính sách bảo hành riêng theo từng thương hiệu.",
        ],
      },
      {
        heading: "2. Quy trình bảo hành",
        points: [
          "Bước 1: Gửi yêu cầu qua trang hậu mãi hoặc hotline.",
          "Bước 2: Kiểm tra điều kiện bảo hành dựa trên IMEI/Serial và tình trạng thực tế.",
          "Bước 3: Tiếp nhận - xử lý - thông báo kết quả và phương án trả máy.",
        ],
      },
      {
        heading: "3. Cam kết hỗ trợ",
        points: [
          "Ưu tiên xử lý nhanh cho lỗi ảnh hưởng trực tiếp đến trải nghiệm sử dụng.",
          "Cập nhật trạng thái định kỳ để khách hàng dễ theo dõi.",
          "Tư vấn phương án sửa chữa ngoài bảo hành nếu không đủ điều kiện.",
        ],
      },
    ],
  },
  "thanh-toan": {
    title: "Chính sách thanh toán",
    subtitle: "Đa phương thức, an toàn và xác nhận rõ ràng trước khi trừ tiền.",
    icon: CreditCard,
    highlights: [
      "Hỗ trợ VNPay, chuyển khoản QR và COD.",
      "Xác nhận đơn ngay sau khi thanh toán thành công.",
      "Không lưu thông tin thẻ ngân hàng tại hệ thống bán hàng.",
    ],
    sections: [
      {
        heading: "1. Phương thức hỗ trợ",
        points: [
          "VNPay: ATM nội địa, QR, thẻ quốc tế (tuỳ cổng hỗ trợ).",
          "Chuyển khoản QR: thanh toán nhanh qua mã VietQR.",
          "COD: thanh toán khi nhận hàng (tuỳ khu vực/sản phẩm).",
        ],
      },
      {
        heading: "2. Xác nhận giao dịch",
        points: [
          "Đơn hàng chỉ được xác nhận khi hệ thống nhận trạng thái thanh toán hợp lệ.",
          "Mã đơn và trạng thái được gửi qua email/SMS ngay sau khi tạo đơn.",
          "Nếu thanh toán lỗi, khách hàng có thể thử lại mà không tạo trùng đơn.",
        ],
      },
      {
        heading: "3. Hoàn/điều chỉnh thanh toán",
        points: [
          "Các giao dịch cần hoàn tiền áp dụng theo chính sách đổi/trả hiện hành.",
          "Thời gian hoàn phụ thuộc phương thức thanh toán và ngân hàng phát hành.",
          "Mọi khoản hoàn được thông báo rõ ràng qua kênh liên hệ đã đăng ký.",
        ],
      },
    ],
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    subtitle: "Thu thập tối thiểu dữ liệu cần thiết, sử dụng đúng mục đích và bảo vệ nghiêm ngặt.",
    icon: ShieldCheck,
    highlights: [
      "Không bán dữ liệu cá nhân cho bên thứ ba.",
      "Chỉ chia sẻ dữ liệu cần thiết để hoàn tất giao dịch.",
      "Cho phép cập nhật và yêu cầu xử lý dữ liệu theo quy định.",
    ],
    sections: [
      {
        heading: "1. Dữ liệu được thu thập",
        points: [
          "Thông tin tài khoản: họ tên, email, số điện thoại.",
          "Thông tin giao hàng: địa chỉ nhận, ghi chú đơn hàng.",
          "Thông tin giao dịch: lịch sử mua hàng, trạng thái thanh toán.",
        ],
      },
      {
        heading: "2. Mục đích sử dụng",
        points: [
          "Xử lý đơn hàng, giao hàng, bảo hành và chăm sóc khách hàng.",
          "Gửi thông báo liên quan đến đơn hàng, hậu mãi và cập nhật chính sách.",
          "Cải thiện trải nghiệm mua sắm dựa trên dữ liệu hành vi cơ bản.",
        ],
      },
      {
        heading: "3. Quyền của khách hàng",
        points: [
          "Yêu cầu xem, cập nhật hoặc điều chỉnh thông tin tài khoản.",
          "Yêu cầu dừng nhận thông báo tiếp thị bất kỳ lúc nào.",
          "Yêu cầu hỗ trợ xử lý dữ liệu qua email: support@techstore.vn.",
        ],
      },
    ],
  },
};

const POLICY_ORDER = ["giao-hang", "doi-tra", "bao-hanh", "thanh-toan", "bao-mat"];

export default function PolicyPagePremium() {
  const { type } = useParams();
  const activeType = type || "giao-hang";

  if (!POLICY_CONFIG[activeType]) {
    return <Navigate to="/chinh-sach/giao-hang" replace />;
  }

  const policy = POLICY_CONFIG[activeType];
  const Icon = policy.icon;

  return (
    <div className="bg-white py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trung tâm chính sách</p>
          <nav className="mt-3 space-y-2">
            {POLICY_ORDER.map((key) => (
              <Link
                key={key}
                to={`/chinh-sach/${key}`}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  key === activeType
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {POLICY_CONFIG[key].title}
              </Link>
            ))}
          </nav>

          <div className="mt-6 rounded-xl bg-white p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Cần hỗ trợ thêm?</p>
            <p className="mt-1">Hotline: 1900 2345</p>
            <p>Email: support@techstore.vn</p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-600 p-3 text-white">
                <Icon size={20} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">{policy.title}</h1>
                <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">{policy.subtitle}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {policy.highlights.map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </header>

          <div className="space-y-4">
            {policy.sections.map((section) => (
              <article key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2>
                <ul className="mt-3 space-y-2">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-7 text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6">
            <p className="text-sm text-slate-600">
              Chính sách có thể được cập nhật để phù hợp với quy định pháp lý và quy trình vận hành mới.
              Phiên bản mới nhất luôn được công bố tại trang này.
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}

