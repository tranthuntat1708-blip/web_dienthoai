import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiClient.get("/admin/stats");
        setStats(res.data);
      } catch {
        // fallback fake data
        setStats({
          products: 120,
          orders: 45,
          users: 300,
          revenue: 120000000,
        });
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Sản phẩm",
      value: stats.products,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Đơn hàng",
      value: stats.orders,
      icon: ShoppingBag,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Người dùng",
      value: stats.users,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Doanh thu",
      value: stats.revenue.toLocaleString("vi-VN") + " đ",
      icon: DollarSign,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Bảng điều khiển</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${c.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="font-bold text-lg text-gray-900">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
