import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { AuthContextType, User } from "../types/authTypes.ts";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    error: auth0Error,
  } = useAuth0();

  const [user, setUser] = useState<User | null>(null);

  // Mapear usuario de Auth0 a nuestro tipo
  useEffect(() => {
    if (auth0IsAuthenticated && auth0User) {
      setUser({
        id: auth0User.sub || "",
        email: auth0User.email || "",
        name: auth0User.name || "",
        avatarUrl: auth0User.picture,
      });
    } else {
      setUser(null);
    }
  }, [auth0IsAuthenticated, auth0User]);

  // Login
  const login = useCallback(
    async (returnTo?: string) => {
      try {
        await loginWithRedirect({
          appState: {
            returnTo: returnTo || window.location.pathname,
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [loginWithRedirect]
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [auth0Logout]);

  // Obtener y guardar token
  const getAccessToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      localStorage.setItem("access_token", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return undefined;
    }
  }, [getAccessTokenSilently]);

  // Auto-obtener token cuando el usuario está autenticado
  useEffect(() => {
    if (auth0IsAuthenticated && !isLoading) {
      getAccessToken();
    }
  }, [auth0IsAuthenticated, isLoading, getAccessToken]);

  const value: AuthContextType = {
    user,
    isAuthenticated: auth0IsAuthenticated,
    isLoading,
    error: auth0Error?.message || null,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
