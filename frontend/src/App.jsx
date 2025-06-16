import {
  SignedIn,
  SignedOut,
  SignIn,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/adminDashboard";
import LoginCard from "./components/admin/loginCard";

function App() {
  return (
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
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

export default App;
