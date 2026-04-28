import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function RequireGuest({ children }) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  if (!user) return children;

  return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
}

