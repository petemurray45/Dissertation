import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import PropertyPage from "./pages/user/PropertyPage";
import ViewListing from "./pages/user/ViewListing";
import UserLogin from "./pages/user/UserLogin";
import Profile from "./pages/user/Profile";
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
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* User Routes */}
        <Route path="/home" element={<UserDashboard />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/properties/:id" element={<ViewListing />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin/addproperty" element={<AdminAddProperty />} />

        <Route path="/admin/property/:id" element={<AdminProductPage />} />

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </>
  );
}

export default App;
