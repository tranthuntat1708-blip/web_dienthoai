// src/pages/admin/AdminPromotions.jsx
import { useState, useEffect } from 'react';
import { Plus, Tag, Zap, Trash2 } from 'lucide-react';
import apiClient from '../../api/client';
import { formatVnd } from '../../utils/format';
import toast from 'react-hot-toast';

export default function AdminPromotions() {
  const [vouchers, setVouchers] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [tab, setTab] = useState('voucher'); // 'voucher' | 'flash'
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    code: '', discountPercent: '', maxDiscountAmount: '',
    minOrderAmount: '', maxUsageCount: '', expiresAt: '',
});

  useEffect(() => {
    apiClient.get('/vouchers').then(r => setVouchers(r.data ?? [])).catch(() => {});
    apiClient.get('/flashsales').then(r => setFlashSales(r.data?.items ?? r.data ?? [])).catch(() => {});
  }, []);

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function createVoucher() {
    try {
      await apiClient.post('/vouchers', {
 ...form,
        discountPercent: Number(form.discountPercent),
        maxDiscountAmount: Number(form.maxDiscountAmount),
        minOrderAmount: Number(form.minOrderAmount),
        maxUsageCount: Number(form.maxUsageCount),
      });
      toast.success('Tạo voucher thành công!');
      setModal(null);
      apiClient.get('/vouchers').then(r => setVouchers(r.data ?? []));
    } catch (err) { toast.error(err.response?.data?.message ?? 'Lỗi'); }
  }

  async function deleteVoucher(id, code) {
  if (!confirm(`Xóa voucher "${code}"?`)) return;
    try {
      await apiClient.delete(`/vouchers/${id}`);
      toast.success('Đã xóa voucher');
      setVouchers(v => v.filter(x => x.id !== id));
    } catch { toast.error('Không thể xóa'); }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Quản lý khuyến mãi</h1>

      {/* Tabs */}
   <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[{ key: 'voucher', label: '🏷️ Voucher', icon: Tag }, { key: 'flash', label: '⚡ Flash Sale', icon: Zap }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
    {t.label}
   </button>
        ))}
      </div>

      {/* VOUCHER tab */}
      {tab === 'voucher' && (
     <div className="space-y-4">
  <button onClick={() => setModal('voucher')} className="btn-primary flex items-center gap-2 text-sm">
 <Plus size={16} /> Tạo voucher mới
  </button>
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
   {vouchers.map(v => (
      <div key={v.id} className="bg-white rounded-2xl border border-dashed border-amber-300 p-5 relative">
    <button onClick={() => deleteVoucher(v.id, v.code)}
    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
     <Trash2 size={15} />
     </button>
         <div className="flex items-center gap-2 mb-3">
 <div className="bg-amber-100 rounded-xl p-2">
  <Tag size={18} className="text-amber-600" />
     </div>
     <span className="font-bold text-lg text-gray-900 font-mono tracking-wide">{v.code}</span>
     </div>
  <div className="space-y-1.5 text-sm">
    <div className="flex justify-between">
  <span className="text-gray-500">Giảm</span>
 <span className="font-bold text-red-600">{v.discountPercent}%</span>
    </div>
    <div className="flex justify-between">
   <span className="text-gray-500">Tối đa</span>
 <span className="font-medium">{formatVnd(v.maxDiscountAmount)}</span>
   </div>
 <div className="flex justify-between">
    <span className="text-gray-500">Đơn tối thiểu</span>
  <span className="font-medium">{formatVnd(v.minOrderAmount)}</span>
 </div>
  <div className="flex justify-between">
      <span className="text-gray-500">Đã dùng</span>
   <span className="font-medium">{v.usedCount}/{v.maxUsageCount}</span>
  </div>
        <div className="flex justify-between">
  <span className="text-gray-500">Hết hạn</span>
     <span className="font-medium">{new Date(v.expiresAt).toLocaleDateString('vi-VN')}</span>
  </div>
         </div>
<div className={`mt-3 text-center text-xs font-semibold py-1 rounded-full ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
   {v.isActive ? '✓ Đang hoạt động' : 'Đã tắt'}
            </div>
  </div>
 ))}
    </div>
        </div>
    )}

      {/* FLASH SALE tab */}
      {tab === 'flash' && (
     <div className="space-y-4">
    <div className="space-y-3">
       {flashSales.map(fs => (
    <div key={fs.id} className="bg-white rounded-2xl border border-gray-100 p-5">
   <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
     <Zap size={20} className="text-yellow-500 fill-yellow-400" />
  <h3 className="font-bold text-gray-900">{fs.name}</h3>
   <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fs.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
     {fs.isActive ? 'Đang chạy' : 'Đã kết thúc'}
            </span>
      </div>
          </div>
     <p className="text-xs text-gray-500">
     🕐 {new Date(fs.startAt).toLocaleString('vi-VN')} — {new Date(fs.endAt).toLocaleString('vi-VN')}
     </p>
  </div>
     ))}
  {flashSales.length === 0 && (
    <div className="text-center py-12 text-gray-400">
     <Zap size={36} className="mx-auto mb-2 text-gray-200" />
   <p>Chưa có flash sale nào</p>
       </div>
  )}
   </div>
 </div>
      )}

      {/* Modal tạo voucher */}
      {modal === 'voucher' && (
     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
     <h2 className="font-bold text-gray-900 text-lg">Tạo voucher mới</h2>
  <div className="grid grid-cols-2 gap-3">
    {[
 { name: 'code', label: 'Mã voucher *', col: 2 },
      { name: 'discountPercent', label: 'Giảm (%)', type: 'number' },
     { name: 'maxDiscountAmount', label: 'Giảm tối đa (VNĐ)', type: 'number' },
   { name: 'minOrderAmount', label: 'Đơn tối thiểu (VNĐ)', type: 'number' },
       { name: 'maxUsageCount', label: 'Số lần dùng', type: 'number' },
    { name: 'expiresAt', label: 'Ngày hết hạn', type: 'datetime-local', col: 2 },
    ].map(f => (
     <div key={f.name} className={f.col === 2 ? 'col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
         <input name={f.name} type={f.type ?? 'text'} value={form[f.name]} onChange={handleChange}
   className="input text-sm uppercase" />
   </div>
    ))}
   </div>
   <div className="flex gap-3">
     <button onClick={() => setModal(null)} className="flex-1 btn-outline">Hủy</button>
  <button onClick={createVoucher} className="flex-1 btn-primary">Tạo voucher</button>
  </div>
  </div>
  </div>
      )}
    </div>
  );
}
