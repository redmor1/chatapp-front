import { useAuth } from "../hooks/useAuth";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Cerrar Sesión
    </button>
  );
};
