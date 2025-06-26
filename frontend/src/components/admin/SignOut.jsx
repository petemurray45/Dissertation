import React from "react";


function SignOut() {
  
  return (
    <div>
      <button className="btn" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}

export default SignOut;
