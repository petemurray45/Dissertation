import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import PropertyPage from "./pages/user/PropertyPage";
import ViewListing from "./pages/user/ViewListing";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import { LoadScript } from "@react-google-maps/api";
function App() {
  return (
    <>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          {/* User Routes */}
          <Route path="/home" element={<UserDashboard />} />
          <Route path="/properties" element={<PropertyPage />} />
          <Route path="/properties/:id" element={<ViewListing />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          <Route path="/admin/addproperty" element={<AdminAddProperty />} />

          <Route path="/admin/property/:id" element={<AdminProductPage />} />

          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </LoadScript>
    </>
  );
}

export default App;
