import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignIn,
} from "@clerk/clerk-react";

function LoginCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="p-6 rounded-lg bg-base-100">
        <SignIn routing="path" path="/sign-in" />
      </div>
    </div>
  );
}

export default LoginCard;
