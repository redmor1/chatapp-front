import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router";

export const LoginButton = () => {
  const { login, isLoading } = useAuth();
  const location = useLocation();

  const handleLogin = () => {
    // Obtener returnTo del state (viene de ProtectedRoute) o usar /chat por defecto
    const returnTo =
      (location.state as { returnTo?: string })?.returnTo || "/chat";
    login(returnTo);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Cargando..." : "Iniciar Sesión"}
    </button>
  );
};
