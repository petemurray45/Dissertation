import adminLogin from "./pages/admin/adminLogin";
import {
  SignedIn,
  SignedOut,
  SignIn,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <SignedIn>
            <adminLogin />
          </SignedIn>
        }
      />
      <Route
        path="/sign-in"
        element={<SignIn routing="path" path="/sign-in" />}
      />
      <Route path="*" element={<RedirectToSignIn />} />
    </Routes>
  );
}

export default App;
