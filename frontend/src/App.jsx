
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminAddProperty from "./pages/admin/AdminAddProperty";


function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* User Routes */}
        <Route path="/home" element={<UserDashboard />} />
        

        <Route path="/addproperty" element={<AdminAddProperty />} />

        <Route path="/property/:id" element={<AdminProductPage />} />

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </>
  );
}

export default App;
