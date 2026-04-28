// src/pages/ContactPage.jsx
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,_#f8fbff_0%,_#ffffff_45%,_#eef4ff_100%)] py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Liên hệ TechStore</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Thông tin */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin /> <span>70 Lữ Gia, Quận 11, TP.HCM</span>
            </div>
            <div className="flex gap-3">
              <Phone /> <span>1900 2345</span>
            </div>
            <div className="flex gap-3">
              <Mail /> <span>support@techstore.vn</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <input placeholder="Họ tên" className="input" />
            <input placeholder="Email" className="input" />
            <textarea placeholder="Nội dung..." className="input h-24" />
            <button className="btn-primary w-full">Gửi liên hệ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
