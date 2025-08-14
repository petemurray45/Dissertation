import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import PropertyPage from "./pages/user/PropertyPage";
import ViewListing from "./pages/user/ViewListing";
import Profile from "./pages/user/Profile";
import PropPal from "./pages/user/PropPal";
import AgencyAuth from "./components/user/auth/AgencyAuth";
import UserAuth from "./components/user/auth/UserAuth";
import AgencyDashboard from "./pages/agency/AgencyDashboard";
import AdminAuth from "./components/user/auth/AdminAuth";
import RouteProtector from "./components/routing/RouteProtection";
import { useUserStore } from "./utils/useUserStore";
import { useEffect } from "react";
import { useAdminStore } from "./utils/useAdminStore";
import { useAgencyStore } from "./utils/useAgencyStore";
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

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/addproperty" element={<AdminAddProperty />} />
          <Route path="/admin/property/:id" element={<AdminProductPage />} />

          <Route path="/admin/login" element={<AdminAuth />} />

          {/* Agency Routes */}

          <Route path="/agency/dashboard" element={<AgencyDashboard />} />

          <Route path="/agencyLogin" element={<AgencyAuth />} />

          {/* User Routes */}

          <Route path="profile" element={<Profile />} />

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
