import { useUser } from "../hooks/useUser";
import { Avatar } from "../../../shared/components/Avatar";

interface UserProfileButtonProps {
  onClick: () => void;
}

export function UserProfileButton({ onClick }: UserProfileButtonProps) {
  const { profile, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
        <span className="text-sm text-gray-400">Cargando...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <button
        onClick={onClick}
        className="flex items-center space-x-2 px-2 hover:opacity-70 transition-opacity"
      >
        <Avatar src={null} alt="Usuario" size="sm" />
        <span className="text-sm text-gray-600">Usuario</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-2 hover:opacity-70 transition-opacity cursor-pointer"
    >
      <Avatar src={profile.avatarUrl} alt={profile.nombre} size="sm" />
      <span className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
        {profile.nombre}
      </span>
    </button>
  );
}
