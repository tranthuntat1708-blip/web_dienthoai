import { Link, Navigate, useParams } from "react-router-dom";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const policies = {
  "giao-hang": {
    title: "Chính sách giao hàng",
    icon: Truck,
    content: (
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <h3 className="text-lg font-bold text-blue-700">Giao nhanh, cập nhật rõ từng bước</h3>
          <p className="mt-2 text-sm leading-6 text-blue-900">
            TechStore ưu tiên xác nhận đơn sớm, giao đúng phiên bản và hiển thị
            trạng thái đơn hàng rõ ràng để bạn dễ theo dõi.
          </p>
        </div>

        <h3 className="text-lg font-bold">1. Phạm vi giao hàng</h3>
        <p>
          TechStore giao hàng toàn quốc thông qua các đối tác vận chuyển uy tín.
          Một số khu vực nội thành có thể được ưu tiên giao nhanh trong ngày tùy
          thời điểm đặt hàng và tình trạng tồn kho.
        </p>

        <h3 className="text-lg font-bold">2. Thời gian giao hàng</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>TP.HCM: từ 2 giờ đến 24 giờ với đơn đủ điều kiện giao nhanh.</li>
          <li>Hà Nội, Đà Nẵng và thành phố lớn: 1 - 2 ngày làm việc.</li>
          <li>Các tỉnh/thành khác: 3 - 5 ngày làm việc.</li>
          <li>Hàng đặt trước, hàng limited hoặc hàng cần điều chuyển sẽ được báo lịch riêng.</li>
        </ul>

        <h3 className="text-lg font-bold">3. Phí vận chuyển và kiểm hàng</h3>
        <p>
          Miễn phí giao hàng cho đơn từ 500.000đ. Đơn dưới mức này sẽ hiển thị
          phí ship cụ thể khi thanh toán. Khi nhận hàng, bạn nên kiểm tra ngoại
          quan hộp, đúng phiên bản và đúng phụ kiện cơ bản trước khi ký nhận.
        </p>

        <h3 className="text-lg font-bold">4. Theo dõi đơn hàng</h3>
        <p>
          Sau khi đặt hàng, bạn có thể theo dõi trạng thái trực quan ngay trên
          trang chi tiết đơn hàng với các mốc: chờ xác nhận, đang xử lý, đang
          giao và hoàn tất.
        </p>
      </div>
    ),
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    icon: RotateCcw,
    content: (
      <div className="space-y-5">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <h3 className="text-lg font-bold text-emerald-700">
            Đổi trả "Không rườm rà"
          </h3>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Nếu sản phẩm lỗi kỹ thuật, giao sai mẫu, sai màu hoặc sai dung lượng,
            TechStore ưu tiên xác nhận nhanh, ít thủ tục và thông báo rõ hướng xử lý.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold">1. Khi nào bạn có thể đổi/trả?</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Trong vòng 7 ngày kể từ khi nhận hàng với lỗi do cửa hàng hoặc nhà sản xuất.</li>
            <li>Sản phẩm lỗi kỹ thuật hoặc giao sai phiên bản, sai màu, sai dung lượng.</li>
            <li>Thiết bị còn số IMEI hoặc serial, còn phụ kiện cơ bản và không hư hỏng do rơi vỡ, vào nước hoặc can thiệp phần cứng.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold">2. Quy trình xử lý cực gọn</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[
              { step: "Bước 1", text: "Gửi mã đơn hàng, số điện thoại và hình ảnh hoặc video lỗi nếu có." },
              { step: "Bước 2", text: "Bộ phận hỗ trợ kiểm tra nhanh và xác nhận hướng xử lý trong giờ làm việc." },
              { step: "Bước 3", text: "Đổi máy, đổi sản phẩm tương đương hoặc hoàn tiền theo kết quả kiểm tra." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{item.step}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">3. Hoàn tiền, bảo hành và ngoại lệ</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Hoàn tiền qua chuyển khoản trong 3 - 5 ngày làm việc sau khi duyệt.</li>
            <li>Máy mới chính hãng vẫn áp dụng chính sách bảo hành của hãng theo từng dòng sản phẩm.</li>
            <li>Phụ kiện tiêu hao, quà tặng khuyến mãi hoặc sản phẩm hư hỏng do người dùng không thuộc phạm vi đổi trả nhanh.</li>
            <li>Trường hợp cần hỗ trợ gấp, bạn có thể liên hệ hotline để được ưu tiên xử lý.</li>
          </ul>
        </div>
      </div>
    ),
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    icon: ShieldCheck,
    content: (
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-bold text-slate-900">Bảo mật dữ liệu khách hàng</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            TechStore chỉ sử dụng thông tin cần thiết để xử lý đơn hàng, chăm sóc
            khách hàng và cải thiện trải nghiệm mua sắm.
          </p>
        </div>

        <h3 className="text-lg font-bold">1. Thu thập thông tin</h3>
        <p>
          Chúng tôi có thể thu thập họ tên, số điện thoại, địa chỉ nhận hàng,
          email, lịch sử đơn hàng và thông tin đăng nhập để phục vụ giao dịch.
        </p>

        <h3 className="text-lg font-bold">2. Mục đích sử dụng</h3>
        <p>
          Dữ liệu được dùng để xác nhận đơn hàng, giao hàng, hỗ trợ bảo hành,
          xử lý đổi trả và gửi thông báo liên quan đến giao dịch của bạn.
        </p>

        <h3 className="text-lg font-bold">3. Cam kết bảo mật</h3>
        <p>
          TechStore không bán dữ liệu cá nhân cho bên thứ ba. Thông tin chỉ được
          chia sẻ với đơn vị vận chuyển hoặc đối tác thanh toán khi cần để hoàn
          tất đơn hàng.
        </p>

        <h3 className="text-lg font-bold">4. Quyền của người dùng</h3>
        <p>
          Bạn có thể yêu cầu cập nhật thông tin tài khoản, tra cứu đơn hàng hoặc
          liên hệ bộ phận hỗ trợ nếu cần kiểm tra dữ liệu đã cung cấp.
        </p>
      </div>
    ),
  },
};

export default function PolicyPageClean() {
  const { type } = useParams();

  if (!type || !policies[type]) {
    return <Navigate to="/chinh-sach/giao-hang" replace />;
  }

  const current = policies[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto flex max-w-6xl gap-8 px-4">
        <div className="w-64">
          <h3 className="mb-4 font-bold">Chính sách</h3>
          {Object.keys(policies).map((key) => (
            <Link
              key={key}
              to={`/chinh-sach/${key}`}
              className={`mb-2 block rounded-lg px-4 py-2 ${
                type === key ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {policies[key].title}
            </Link>
          ))}
        </div>

        <div className="flex-1 rounded-xl bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <Icon />
            <h1 className="text-xl font-bold">{current.title}</h1>
          </div>
          {current.content}
        </div>
      </div>
    </div>
  );
}
