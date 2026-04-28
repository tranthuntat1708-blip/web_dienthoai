import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

function getPasswordStrength(password = "") {
  if (!password) return { label: "None", score: 0, tone: "bg-slate-200" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { label: "Weak", score, tone: "bg-red-500" };
  if (score <= 3) return { label: "Medium", score, tone: "bg-amber-500" };
  return { label: "Strong", score, tone: "bg-emerald-600" };
}

function validateField({ isRegister, name, value }) {
  const raw = String(value ?? "").trim();
  if (name === "fullName" && isRegister) {
    if (raw.length < 2) return "Please enter your full name.";
    return "";
  }
  if (name === "email") {
    if (!raw) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return "Invalid email format.";
    return "";
  }
  if (name === "password") {
    if (!raw) return "Please enter your password.";
    if (raw.length < 8) return "Password must be at least 8 characters.";
    return "";
  }
  return "";
}

function FloatingInput({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  success,
  rightSlot,
  placeholder = "",
  autoComplete,
}) {
  const active = Boolean(value);
  const stateClass = error
    ? "border-red-300 bg-red-50/40"
    : success
      ? "border-emerald-300 bg-emerald-50/30"
      : "border-slate-200 bg-white";

  return (
    <div className="space-y-2">
      <div
        className={`relative rounded-xl border px-3 py-2.5 transition duration-200 focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(15,98,254,0.18)] ${stateClass}`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-slate-400" />
          <div className="relative min-w-0 flex-1">
            <label className={`form-label-float ${active ? "form-label-float-active" : ""}`}>{label}</label>
            <input
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={active ? placeholder : ""}
              autoComplete={autoComplete}
              className="w-full bg-transparent pt-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          {rightSlot}
          {success && !error ? <CheckCircle2 size={16} className="text-emerald-600" /> : null}
        </div>
      </div>
      {error ? (
        <p className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
          <XCircle size={13} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function LoginPagePremium() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const fieldErrors = useMemo(
    () => ({
      fullName: validateField({ isRegister, name: "fullName", value: form.fullName }),
      email: validateField({ isRegister, name: "email", value: form.email }),
      password: validateField({ isRegister, name: "password", value: form.password }),
    }),
    [form, isRegister],
  );

  const isFormValid = useMemo(() => {
    if (isRegister) return !fieldErrors.fullName && !fieldErrors.email && !fieldErrors.password;
    return !fieldErrors.email && !fieldErrors.password;
  }, [fieldErrors, isRegister]);

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function redirectAfterLogin(authData) {
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
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        await authApi.register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created successfully. Please sign in.");
        setIsRegister(false);
        setForm((prev) => ({ ...prev, password: "" }));
        setTouched({});
      } else {
        data = await authApi.login({
          email: form.email,
          password: form.password,
        });

        login(data);
        toast.success("Sign in successful.");
        redirectAfterLogin(data);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-10">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden animate-fade-up rounded-3xl bg-slate-900 p-10 text-white lg:block">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            <ShieldCheck size={13} />
            Secure Account
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
            {isRegister ? "Create your TechStore account." : "Welcome back to TechStore."}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Fast checkout, order tracking, and saved preferences in one place.
          </p>
        </section>

        <section className="surface-card animate-fade-up rounded-3xl p-6 md:p-8">
          <div className="mb-7 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{isRegister ? "Create Account" : "Sign In"}</h2>
            <p className="text-sm text-slate-600">
              {isRegister
                ? "Create an account to track your orders and save favorites."
                : "Use your account to continue your purchase."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister ? (
              <FloatingInput
                icon={UserRound}
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName ? fieldErrors.fullName : ""}
                success={Boolean(touched.fullName && !fieldErrors.fullName && form.fullName)}
                placeholder="John Doe"
                autoComplete="name"
              />
            ) : null}

            <FloatingInput
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? fieldErrors.email : ""}
              success={Boolean(touched.email && !fieldErrors.email && form.email)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <FloatingInput
              icon={Lock}
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? fieldErrors.password : ""}
              success={Boolean(touched.password && !fieldErrors.password && form.password)}
              placeholder="At least 8 characters"
              autoComplete={isRegister ? "new-password" : "current-password"}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-400 transition hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {isRegister ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Password strength</span>
                  <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.tone}`}
                    style={{ width: `${Math.max(10, passwordStrength.score * 25)}%` }}
                  />
                </div>
              </div>
            ) : null}

            <button type="submit" className="btn-primary w-full py-3 text-sm font-bold" disabled={loading || !isFormValid}>
              {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "New to TechStore?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister((prev) => !prev);
                setTouched({});
                setShowPassword(false);
              }}
              className="font-semibold text-blue-700 transition hover:text-blue-800"
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

