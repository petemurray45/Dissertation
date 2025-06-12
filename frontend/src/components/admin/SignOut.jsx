import React from "react";
import { useClerk } from "@clerk/clerk-react";

function SignOut() {
  const { signOut } = useClerk();
  return (
    <div>
      <button className="btn" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default SignOut;
