// src/pages/PolicyPage.jsx
import { useParams, Link, Navigate } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const policies = {
  "giao-hang": {
    title: "Chính sách giao hàng",
    icon: Truck,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold">1. Phạm vi giao hàng</h3>
        <p>
          TechStore hỗ trợ giao hàng toàn quốc thông qua các đơn vị vận chuyển
          uy tín.
        </p>

        <h3 className="text-lg font-bold">2. Thời gian giao hàng</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>TP.HCM / Hà Nội: 1 - 2 ngày</li>
          <li>Tỉnh khác: 3 - 5 ngày</li>
        </ul>

        <h3 className="text-lg font-bold">3. Phí vận chuyển</h3>
        <p>
          Miễn phí cho đơn hàng từ 500.000đ, dưới mức này tính theo phí vận
          chuyển.
        </p>
      </div>
    ),
  },

  "doi-tra": {
    title: "Chính sách đổi trả",
    icon: RotateCcw,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold">1. Điều kiện đổi trả</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Trong vòng 7 ngày</li>
          <li>Sản phẩm lỗi từ nhà sản xuất</li>
          <li>Nguyên hộp, đầy đủ phụ kiện</li>
        </ul>

        <h3 className="text-lg font-bold">2. Bảo hành</h3>
        <p>Thiết bị được bảo hành chính hãng 6 - 12 tháng.</p>

        <h3 className="text-lg font-bold">3. Hoàn tiền</h3>
        <p>Hoàn tiền qua chuyển khoản trong 3 - 5 ngày.</p>
      </div>
    ),
  },

  "bao-mat": {
    title: "Chính sách bảo mật",
    icon: ShieldCheck,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold">1. Thu thập thông tin</h3>
        <p>
          Chúng tôi thu thập thông tin để xử lý đơn hàng và hỗ trợ khách hàng.
        </p>

        <h3 className="text-lg font-bold">2. Cam kết</h3>
        <p>Không chia sẻ thông tin khách hàng cho bên thứ 3.</p>

        <h3 className="text-lg font-bold">3. Quyền người dùng</h3>
        <p>Bạn có thể chỉnh sửa hoặc xoá thông tin bất kỳ lúc nào.</p>
      </div>
    ),
  },
};

export default function PolicyPage() {
  const { type } = useParams();

  if (!type || !policies[type]) {
    return <Navigate to="/chinh-sach/giao-hang" replace />;
  }

  const current = policies[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        {/* Sidebar */}
        <div className="w-64">
          <h3 className="font-bold mb-4">Chính sách</h3>
          {Object.keys(policies).map((k) => (
            <Link
              key={k}
              to={`/chinh-sach/${k}`}
              className={`block px-4 py-2 rounded-lg mb-2 ${
                type === k ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {policies[k].title}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Icon />
            <h1 className="text-xl font-bold">{current.title}</h1>
          </div>
          {current.content}
        </div>
      </div>
    </div>
  );
}
