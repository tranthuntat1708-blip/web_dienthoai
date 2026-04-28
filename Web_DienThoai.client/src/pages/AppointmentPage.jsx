// src/pages/AppointmentPage.jsx
import { useState } from 'react';
import { CheckCircle, Calendar, Clock, Upload } from 'lucide-react';
import AppointmentForm from '../components/appointment/AppointmentForm';

export default function AppointmentPage() {
  const [success, setSuccess] = useState(false);

  if (success) return (
  <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h1>
      <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ xác nhận lịch tư vấn trong vòng 2 giờ làm việc.</p>
      <button onClick={() => setSuccess(false)} className="btn-primary">Đặt lịch khác</button>
   </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
  <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900">Đặt lịch tư vấn</h1>
     <p className="text-gray-500 mt-2 max-w-xl mx-auto">
  Đội ngũ của TechStore sẽ hỗ trợ bạn chọn máy, phụ kiện hoặc phương án lên đời phù hợp với nhu cầu thật.
     </p>
 </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
     {[
  { icon: Calendar, title: 'Chọn ngày & giờ', desc: 'Linh hoạt theo lịch của bạn, từ 8h - 17h' },
  { icon: Upload, title: 'Gửi ảnh tham khảo', desc: 'Có thể đính kèm ảnh máy cũ, phụ kiện hoặc nhu cầu sử dụng để tư vấn nhanh hơn' },
     { icon: Clock, title: 'Xác nhận trong 2h', desc: 'Nhân viên sẽ liên hệ xác nhận qua điện thoại' },
 ].map(({ icon: Icon, title, desc }) => (
   <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
   <Icon size={24} className="text-amber-600" />
      </div>
       <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
     <p className="text-sm text-gray-500">{desc}</p>
    </div>
 ))}
      </div>

      <div className="max-w-xl mx-auto">
        <AppointmentForm onSuccess={() => setSuccess(true)} />
      </div>
    </div>
  );
}
