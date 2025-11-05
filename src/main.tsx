import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./root.css";
import App from "./App.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthContext.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "./config/auth0.ts";
import { AuthCallback } from "./features/auth/components/AuthCallback.tsx";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute.tsx";
import ChatPage from "./pages/ChatPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider {...auth0Config}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/" element={<App />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<div>Profile Page</div>} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Auth0Provider>
  </StrictMode>
);
