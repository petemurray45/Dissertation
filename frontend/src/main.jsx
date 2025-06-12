import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

/**
 * 
 * 
 * const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.log("Error with publishable key");
}
 * 
 * 
 * 
 */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey="pk_test_dHJ1ZS1tb25zdGVyLTExLmNsZXJrLmFjY291bnRzLmRldiQ"
      afterSignOutUrl="/"
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
