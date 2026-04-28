// src/pages/admin/AdminAppointments.jsx
import { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  New:       { label: 'Mới',          icon: Clock,   cls: 'bg-yellow-100 text-yellow-700' },
  Confirmed: { label: 'Đã xác nhận',  icon: CheckCircle,  cls: 'bg-blue-100 text-blue-700' },
  Completed: { label: 'Hoàn thành',   icon: CheckCircle,  cls: 'bg-green-100 text-green-700' },
  Cancelled: { label: 'Đã hủy',       icon: XCircle,      cls: 'bg-red-100 text-red-700' },
};
const NEED_MAP = { NewDesign: 'Thiết kế mới', Renovation: 'Cải tạo', RetailPurchase: 'Mua lẻ' };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
const PAGE_SIZE = 15;

  const fetch = () => {
    apiClient.get(`/appointments?page=${page}&pageSize=${PAGE_SIZE}${statusFilter ? `&status=${statusFilter}` : ''}`)
      .then(r => { setAppointments(r.data.items ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => {});
  };

  useEffect(() => { fetch(); }, [page, statusFilter]);

  async function updateStatus(id, status, adminNote = '') {
    try {
      await apiClient.put(`/appointments/${id}/status`, { status, adminNote });
    toast.success('Cập nhật thành công');
      fetch();
    } catch { toast.error('Không thể cập nhật'); }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
     <p className="text-sm text-gray-400">{total} lịch hẹn</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries({ '': 'Tất cả', ...Object.fromEntries(Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label])) }).map(([k, label]) => (
        <button key={k} onClick={() => { setStatusFilter(k); setPage(1); }}
     className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${statusFilter === k ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
   </button>
    ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
      <table className="w-full text-sm">
     <thead className="bg-gray-50">
            <tr>
        {['Khách hàng', 'Nhu cầu', 'Ngày hẹn', 'Giờ', 'File đính kèm', 'Trạng thái', 'Hành động'].map(h => (
       <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
           ))}
  </tr>
       </thead>
  <tbody className="divide-y divide-gray-50">
       {appointments.map(a => {
          const st = STATUS_MAP[a.status] ?? STATUS_MAP['New'];
    return (
        <tr key={a.id} className="hover:bg-gray-50">
       <td className="px-5 py-3">
               <p className="font-medium text-gray-800">{a.fullName}</p>
              <p className="text-xs text-gray-400">{a.phone} · {a.email}</p>
      </td>
  <td className="px-5 py-3 text-gray-600">{NEED_MAP[a.need] ?? a.need}</td>
   <td className="px-5 py-3 whitespace-nowrap text-gray-700">
     {new Date(a.appointmentDate).toLocaleDateString('vi-VN')}
         </td>
     <td className="px-5 py-3 text-gray-700">{a.appointmentTime}</td>
        <td className="px-5 py-3">
           {a.attachmentFileName ? (
         <a href={`/api/appointments/${a.id}/attachment`}
           className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs">
               <Download size={14} /> {a.attachmentFileName}
            </a>
     ) : <span className="text-gray-300">—</span>}
            </td>
        <td className="px-5 py-3">
           <span className={`text-xs font-medium px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
    </td>
        <td className="px-5 py-3">
       <div className="flex items-center gap-1">
   {a.status === 'New' && (
   <button onClick={() => updateStatus(a.id, 'Confirmed')}
   className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              Xác nhận
       </button>
       )}
         {a.status === 'Confirmed' && (
               <button onClick={() => updateStatus(a.id, 'Completed')}
           className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
         Hoàn thành
          </button>
         )}
 {(a.status === 'New' || a.status === 'Confirmed') && (
 <button onClick={() => updateStatus(a.id, 'Cancelled')}
               className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
       Hủy
  </button>
 )}
  </div>
         </td>
         </tr>
  );
           })}
   {appointments.length === 0 && (
         <tr><td colSpan={7} className="text-center py-12 text-gray-400">Chưa có lịch hẹn nào</td></tr>
              )}
       </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
  className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? 'bg-amber-500 text-white' : 'border border-gray-200 hover:border-amber-400'}`}>
     {p}
   </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
