// SignOut.jsx
import React from "react";
import { useAuthStore } from "../../utils/useAuthStore";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    navigate("/home");
  };

  return (
    <button className="btn font-raleway" onClick={handleSignOut}>
      Sign Out
    </button>
  );
}

export default SignOut;
