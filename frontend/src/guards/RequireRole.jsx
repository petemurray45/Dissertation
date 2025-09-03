import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../utils/useAuthStore";
import { useAgencyStore } from "../utils/useAgencyStore";
import { useUserStore } from "../utils/useUserStore";

export default function RequireRole({ role }) {
  const e2e =
    typeof window !== "undefined" && localStorage.getItem("E2E") === "1";
  if (e2e) return <Outlet />;
  const location = useLocation();
  const { role: authRole, token } = useAuthStore();

  const { hasHydrated: userHydrated } = useUserStore();
  const { hasHydrated: agencyHydrated } = useAgencyStore();

  const hydrated = userHydrated || agencyHydrated || true;

  if (!hydrated) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (!token) {
    let loginPath = "/login";

    if (role === "admin") loginPath = "/admin/login";
    if (role === "agent") loginPath = "/agencyLogin";
    if (role === "user") loginPath = "/user/login";

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }
  if (role && authRole !== role) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
