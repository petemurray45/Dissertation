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
import AgencyDashboard from "./pages/admin/AgencyDashboard";
import AdminAuth from "./components/user/auth/AdminAuth";
import { useUserStore } from "./utils/useUserStore";
import { useEffect } from "react";
function App() {
  const { rehydrate, user, fetchLikedProperties } = useUserStore();

  useEffect(() => {
    (async () => {
      await rehydrate();
    })();
  }, []);

  useEffect(() => {
    console.log("Rehydrated user:", user);
  }, [user]);

  return (
    <>
      <div className="overflow-x-hidden">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/addproperty" element={<AdminAddProperty />} />
          <Route path="/admin/property/:id" element={<AdminProductPage />} />
          <Route path="*" element={<Navigate to="/home" />} />

          {/* Agency Routes */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agencyLogin" element={<AgencyAuth />} />

          {/* User Routes */}
          <Route path="home" element={<UserDashboard />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="properties/:id" element={<ViewListing />} />
          <Route path="profile" element={<Profile />} />
          <Route path="propPal" element={<PropPal />} />

          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/user/login" element={<UserAuth />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
