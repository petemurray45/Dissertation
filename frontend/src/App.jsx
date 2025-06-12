import AdminLogin from "./pages/admin/adminLogin";
import {
  SignedIn,
  SignedOut,
  SignIn,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/adminDashboard";

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
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/sign-in"
        element={
          <>
            <SignedOut>
              <SignIn routing="path" path="/sign-in" />
            </SignedOut>
            <SignedIn>
              <Navigate to="/admin" />
            </SignedIn>
          </>
        }
      />
      <Route path="*" element={<RedirectToSignIn />} />
    </Routes>
  );
}

export default App;
