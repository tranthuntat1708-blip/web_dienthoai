// src/components/common/FlashSaleCountdown.jsx
import { useEffect, useState } from "react";

export default function FlashSaleCountdown() {
  const TOTAL_TIME = 3600;
  const [time, setTime] = useState(TOTAL_TIME);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;
  const urgency = Math.max(0, Math.min(100, Math.round((time / TOTAL_TIME) * 100)));
  const lowTime = time <= 600;

  return (
    <div className="min-w-[180px] rounded-2xl border border-red-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
        <span>Kết thúc sau</span>
        <span>{urgency}%</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[{ label: "Giờ", value: h }, { label: "Phút", value: m }, { label: "Giây", value: s }].map((item) => (
          <div key={item.label} className={`rounded-xl px-2 py-2.5 ${lowTime ? "bg-red-100" : "bg-red-50"}`}>
            <p className={`text-lg font-black ${lowTime ? "animate-pulse text-red-700" : "text-red-600"}`}>{String(item.value).padStart(2, "0")}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-red-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transition-all duration-500 ${lowTime ? "animate-pulse" : ""}`}
          style={{ width: `${urgency}%` }}
        />
      </div>

      <p className={`mt-2 text-[11px] font-semibold ${lowTime ? "text-red-600" : "text-slate-500"}`}>
        {lowTime ? "Sắp hết deal, ưu tiên chốt đơn ngay." : "Deal còn hiệu lực trong khung giờ này."}
      </p>
    </div>
  );
}
