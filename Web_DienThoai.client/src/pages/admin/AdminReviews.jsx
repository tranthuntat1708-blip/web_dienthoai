// src/pages/admin/AdminReviews.jsx
import { useState, useEffect } from 'react';
import { CheckCircle, EyeOff, Star, MessageCircle } from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const PAGE_SIZE = 15;

  const fetch = () => {
    apiClient.get(`/reviews?page=${page}&pageSize=${PAGE_SIZE}&approved=false`)
      .then(r => { setReviews(r.data.items ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => {});
  };

  useEffect(() => { fetch(); }, [page]);

  async function approve(id) {
    try {
      await apiClient.put(`/reviews/${id}/approve`);
   toast.success('Đã duyệt đánh giá');
fetch();
    } catch { toast.error('Lỗi'); }
  }

  async function hide(id) {
    try {
  await apiClient.put(`/reviews/${id}/hide`);
      toast.success('Đã ẩn đánh giá');
      fetch();
    } catch { toast.error('Lỗi'); }
  }

  async function sendReply(id) {
    if (!replyText.trim()) return;
    try {
      await apiClient.put(`/reviews/${id}/reply`, { reply: replyText });
   toast.success('Đã gửi phản hồi');
      setReplyId(null); setReplyText(''); fetch();
    } catch { toast.error('Lỗi'); }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
     <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">Quản lý đánh giá</h1>
        <p className="text-sm text-gray-400">{total} đánh giá chờ duyệt</p>
      </div>

      <div className="space-y-3">
     {reviews.map(r => (
 <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
   <div className="flex items-start justify-between gap-4">
   <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
    {r.userName?.[0] ?? 'U'}
     </div>
        <div>
    <p className="font-semibold text-sm text-gray-800">{r.userName}</p>
         <div className="flex gap-0.5 mt-0.5">
     {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
     ))}
  </div>
         </div>
  </div>
  <div className="flex items-center gap-2 flex-shrink-0">
     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {r.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
          </span>
      {!r.isApproved && (
<button onClick={() => approve(r.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
 <CheckCircle size={16} />
</button>
       )}
      <button onClick={() => hide(r.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
   <EyeOff size={16} />
  </button>
      <button onClick={() => { setReplyId(replyId === r.id ? null : r.id); setReplyText(r.adminReply ?? ''); }}
  className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
              <MessageCircle size={16} />
        </button>
          </div>
     </div>

    <p className="text-sm text-gray-700">{r.comment}</p>

          {r.images?.length > 0 && (
      <div className="flex gap-2">
        {r.images.map((img, i) => (
    <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover" />
   ))}
  </div>
  )}

   {r.adminReply && (
       <div className="pl-3 border-l-2 border-amber-300 text-xs text-gray-500">
   💬 Phản hồi: {r.adminReply}
     </div>
      )}

{replyId === r.id && (
  <div className="flex gap-2">
       <input value={replyText} onChange={e => setReplyText(e.target.value)}
      placeholder="Nhập phản hồi..." className="input text-sm flex-1" />
     <button onClick={() => sendReply(r.id)} className="btn-primary text-sm py-2 px-4">Gửi</button>
 </div>
  )}
  </div>
  ))}

  {reviews.length === 0 && (
  <div className="text-center py-16 text-gray-400">
   <Star size={40} className="mx-auto mb-3 text-gray-200" />
    <p>Không có đánh giá nào chờ duyệt</p>
  </div>
     )}
      </div>

      {totalPages > 1 && (
    <div className="flex justify-center gap-2">
   {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
  <button key={p} onClick={() => setPage(p)}
   className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? 'bg-amber-500 text-white' : 'border border-gray-200'}`}>{p}</button>
  ))}
     </div>
      )}
    </div>
  );
}
