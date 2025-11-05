import { useAuth } from "../hooks/useAuth";

export const LoginButton = () => {
  const { login, isLoading } = useAuth();

  return (
    <button
      onClick={login}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Cargando..." : "Iniciar Sesión"}
    </button>
  );
};
