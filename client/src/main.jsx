import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CountProvider } from "./context/CountProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CountProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CountProvider>
    </BrowserRouter>
  </StrictMode>
);