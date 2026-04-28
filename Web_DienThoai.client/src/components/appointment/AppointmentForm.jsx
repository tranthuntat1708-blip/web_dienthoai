// src/components/appointment/AppointmentForm.jsx
// Form đặt lịch tư vấn: Thu thập thông tin + upload file mặt bằng

import { useState } from 'react';
import { appointmentApi } from '../../api/appointments';

export default function AppointmentForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
 email: '',
    need: 'NewDesign',
 appointmentDate: '',
  appointmentTime: '09:00',
    attachmentBase64: '',
    attachmentFileName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const needs = [
    { value: 'NewDesign', label: 'Tư vấn chọn máy' },
    { value: 'Renovation', label: 'Thu cũ / lên đời' },
    { value: 'RetailPurchase', label: 'Mua phụ kiện / combo' },
  ];

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setForm((prev) => ({ ...prev, attachmentBase64: base64, attachmentFileName: file.name }));
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result?.toString().split(',')[1] ?? '');
  reader.onerror = reject;
  reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await appointmentApi.create(form);
 onSuccess?.();
    } catch {
      setError('Đặt lịch thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold text-gray-800">Đặt lịch tư vấn nhanh</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Họ và tên *" required className="input" />
    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại *" required className="input" />
 </div>
 <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *" required className="input w-full" />

      {/* Nhu cầu */}
      <div className="flex gap-3 flex-wrap">
        {needs.map((n) => (
    <label key={n.value} className="flex items-center gap-2 cursor-pointer text-sm">
     <input type="radio" name="need" value={n.value} checked={form.need === n.value} onChange={handleChange} className="accent-amber-500" />
         {n.label}
     </label>
  ))}
   </div>

      {/* Ngày & Giờ */}
      <div className="grid grid-cols-2 gap-4">
   <input name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} required className="input" min={new Date().toISOString().split('T')[0]} />
     <select name="appointmentTime" value={form.appointmentTime} onChange={handleChange} className="input">
          {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
  </select>
  </div>

      {/* Upload file */}
      <div>
     <label className="block text-sm text-gray-600 mb-1">Ảnh tham khảo / file mô tả nhu cầu (PDF, JPG, PNG)</label>
   <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="text-sm" />
        {form.attachmentFileName && <p className="text-xs text-green-600 mt-1">📎 {form.attachmentFileName}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
        {loading ? 'Đang gửi...' : 'Xác nhận đặt lịch'}
      </button>
    </form>
  );
}
