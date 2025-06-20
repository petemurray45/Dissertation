import {
  SignedIn,
  SignedOut,
  SignIn,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LoginCard from "./components/admin/loginCard";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminNavBar from "./components/admin/adminNavBar";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/admin"
          element={
            <>
              <SignedIn>
                <AdminDashboard />
              </SignedIn>

              <SignedOut>
                <Navigate to="/sign-in" />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/sign-in"
          element={
            <>
              <SignedOut>
                <LoginCard />
              </SignedOut>
              <SignedIn>
                <Navigate to="/admin" />
              </SignedIn>
            </>
          }
        />
        <Route path="property/:id" element={<AdminProductPage />} />

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </>
  );
}

export default App;
