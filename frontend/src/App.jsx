import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import PropertyPage from "./pages/user/PropertyPage";
import ViewListing from "./pages/user/ViewListing";
import Profile from "./pages/user/Profile";
import PropPal from "./pages/user/PropPal";
import AgencyAuth from "./components/user/auth/AgencyAuth";
import UserAuth from "./components/user/auth/UserAuth";
import AgencyDashboard from "./pages/agency/AgencyDashboard";
import AdminAuth from "./components/user/auth/AdminAuth";
import { useUserStore } from "./utils/useUserStore";
import { useEffect } from "react";
import { useAdminStore } from "./utils/useAdminStore";
import { useAgencyStore } from "./utils/useAgencyStore";
import AdminEditProperty from "./pages/admin/AdminEditProperty";
import AgencyAddProperty from "./pages/agency/AgencyAddProperty";
import AgencyEditProperty from "./pages/agency/AgencyEditProperty";
import RequireRole from "./guards/RequireRole";
function App() {
  const { rehydrate: rehydrateUser, hasHydrated: useHasHydrated } =
    useUserStore();
  const { rehydrate: rehydrateAdmin, hasHydrated: adminHasHydrated } =
    useAdminStore();
  const { rehydrate: rehydrateAgent, hasHydrated: agentHasHydrated } =
    useAgencyStore();

  useEffect(() => {
    (async () => {
      await Promise.all([
        rehydrateUser?.(),
        rehydrateAdmin?.(),
        rehydrateAgent?.(),
      ]);
    })();
  }, [rehydrateUser, rehydrateAdmin, rehydrateAgent]);

  return (
    <>
      <div className="overflow-x-hidden">
        <Routes>
          {/* Admin Routes */}

          <Route element={<RequireRole role={"admin"} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/addproperty" element={<AdminAddProperty />} />
            <Route
              path="/admin/properties/edit/:id"
              element={<AdminEditProperty />}
            />
          </Route>

          <Route path="/admin/login" element={<AdminAuth />} />

          {/* Agency Routes */}

          <Route element={<RequireRole role={"agent"} />}>
            <Route path="/agency/dashboard" element={<AgencyDashboard />} />
            <Route path="/agency/addproperty" element={<AgencyAddProperty />} />
            <Route
              path="/agency/editproperty/:id"
              element={<AgencyEditProperty />}
            />
          </Route>

          <Route path="/agencyLogin" element={<AgencyAuth />} />

          {/* User Routes */}

          <Route element={<RequireRole role={"user"} />}>
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="home" element={<UserDashboard />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="properties/:id" element={<ViewListing />} />
          <Route path="propPal" element={<PropPal />} />
          <Route path="/user/login" element={<UserAuth />} />

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
