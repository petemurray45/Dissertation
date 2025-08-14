import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../utils/useUserStore";
import { useAdminStore } from "../../utils/useAdminStore";
import { useAgencyStore } from "../../utils/useAgencyStore";

function getRoleFromToken(token) {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const data = JSON.parse(json);
    return data?.role ?? null;
  } catch {
    return null;
  }
}

function RouteProtector({
  allowed = ["user", "agent", "admin"],
  redirectTo = "/user/login",
}) {
  //prefer store tokens but will also look at local storage to prevent rehydrate race
  const userToken = useUserStore(
    (s) => s.token || localStorage.getItem("token")
  );
  const adminToken = useAdminStore(
    (s) => s.token || localStorage.getItem("admin_token")
  );
  const agencyToken = useAgencyStore(
    (s) => s.token || localStorage.getItem("agency_token")
  );

  // decide role by decoding token -> prefer admin > agent > user if multiple exist
  let role =
    getRoleFromToken(adminToken) ||
    getRoleFromToken(agencyToken) ||
    getRoleFromToken(userToken);

  if (!role) {
    if (adminToken) role = "admin";
    else if (agencyToken) role = "agent";
    else if (userToken) role = "user";
  }

  if (!role) return <Navigate to={redirectTo} replace />; // not logged in
  if (!allowed.includes(role)) return <Navigate to={redirectTo} replace />; // wrong role

  console.log({
    allowed,
    userToken: !!userToken,
    agencyToken: !!agencyToken,
    adminToken: !!adminToken,
    role,
  });

  return <Outlet />;
}

export default RouteProtector;
