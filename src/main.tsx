import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./root.css";
import App from "./App.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./features/auth/context/AuthContext.tsx";
import { Auth0ProviderWithNavigate } from "./features/auth/components/Auth0ProviderWithNavigate.tsx";
import { AuthCallback } from "./features/auth/components/AuthCallback.tsx";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute.tsx";
import { UserProvider } from "./features/user/context/UserContext.tsx";
import ChatPage from "./pages/ChatPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <AuthProvider>
          <Routes>
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/" element={<App />} />
            <Route path="/login" element={<App />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/chat"
                element={
                  <UserProvider>
                    <ChatPage />
                  </UserProvider>
                }
              />
              <Route
                path="/profile"
                element={
                  <UserProvider>
                    <div>Profile Page</div>
                  </UserProvider>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
