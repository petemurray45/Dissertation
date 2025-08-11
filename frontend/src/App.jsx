import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import PropertyPage from "./pages/user/PropertyPage";
import ViewListing from "./pages/user/ViewListing";
import UserLogin from "./pages/user/UserLogin";
import Profile from "./pages/user/Profile";
import PropPal from "./pages/user/PropPal";
import AgencyAuth from "./components/user/AgencyAuth";
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/addproperty" element={<AdminAddProperty />} />
          <Route path="/admin/property/:id" element={<AdminProductPage />} />
          <Route path="*" element={<Navigate to="/admin" />} />
          {/* User Routes */}

          <Route path="home" element={<UserDashboard />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="properties/:id" element={<ViewListing />} />
          <Route path="profile" element={<Profile />} />
          <Route path="propPal" element={<PropPal />} />

          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/agencyLogin" element={<AgencyAuth />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
