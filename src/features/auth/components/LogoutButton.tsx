import { useAuth } from "../hooks/useAuth";

export const LogoutButton = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {user?.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <span className="text-sm text-gray-700">{user?.name}</span>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};
