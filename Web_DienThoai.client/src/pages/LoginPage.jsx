import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const redirectAfterLogin = (authData) => {
    const role = String(
      authData?.role ||
        authData?.user?.role ||
        authData?.data?.role ||
        authData?.data?.user?.role ||
        "",
    )
      .trim()
      .toLowerCase();
    const from = location.state?.from;

    if (role === "admin") {
      navigate(typeof from === "string" && from.startsWith("/admin") ? from : "/admin", {
        replace: true,
      });
      return;
    }

    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        // 1. Xử lý Đăng ký
        await authApi.register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        toast.success("Tạo tài khoản thành công! Hãy đăng nhập.");
        setIsRegister(false);
        setForm((prev) => ({
          ...prev,
          password: "",
        }));
      } else {
        // 2. Xử lý Đăng nhập
        data = await authApi.login({
          email: form.email,
          password: form.password,
        });

        login(data);

        toast.success("Đăng nhập thành công!");
        redirectAfterLogin(data);
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      const message =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.14),_transparent_42%),linear-gradient(150deg,_#f8fbff_0%,_#ffffff_40%,_#eef5ff_100%)] py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl gap-6 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_25px_65px_-35px_rgba(15,23,42,0.7)] lg:block">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            <ShieldCheck size={14} />
            TechStore Account
          </p>

          <h1 className="mt-6 text-4xl font-black leading-tight">
            {isRegister ? "Tạo tài khoản mới trong vài bước." : "Chào mừng bạn quay lại TechStore."}
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {isRegister
              ? "Đăng ký để theo dõi đơn hàng, lưu danh sách yêu thích và nhận ưu đãi cá nhân hóa."
              : "Đăng nhập để tiếp tục mua sắm, xem lịch sử đơn hàng và quản lý thông tin tài khoản nhanh hơn."}
          </p>

          <div className="mt-10 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Đơn hàng</p>
              <p className="mt-1 font-semibold">Theo dõi trạng thái theo thời gian thực</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ưu đãi</p>
              <p className="mt-1 font-semibold">Nhận mã giảm giá và thông báo deal sớm</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.5)] md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              {isRegister ? "Tạo tài khoản" : "Đăng nhập tài khoản"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isRegister
                ? "Đăng ký để lưu đơn hàng, voucher và danh sách yêu thích."
                : "Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Họ và tên</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white">
                  <UserRound size={16} className="text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm outline-none"
                    required
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white">
                <Mail size={16} className="text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Mật khẩu</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-blue-400 focus-within:bg-white">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            {isRegister ? "Bạn đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              {isRegister ? "Đăng nhập ngay" : "Đăng ký ngay"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
