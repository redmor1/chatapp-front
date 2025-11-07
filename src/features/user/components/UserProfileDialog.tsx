import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { Avatar } from "../../../shared/components/Avatar";

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({
  open,
  onOpenChange,
}: UserProfileDialogProps) {
  const { profile, loading: loadingProfile, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [editedName, setEditedName] = useState("");
  const [editedAvatarUrl, setEditedAvatarUrl] = useState("");

  // Sincronizar formData con profile cuando cambia
  useEffect(() => {
    if (profile) {
      setEditedName(profile.nombre);
      setEditedAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  // Resetear estado al abrir el diálogo
  useEffect(() => {
    if (open) {
      setIsEditing(false);
      setSaveError(null);
    }
  }, [open]);

  async function handleSave() {
    if (!profile) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateProfile({
        nombre: editedName.trim() || undefined,
        avatarUrl: editedAvatarUrl.trim() || null,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError("No se pudo guardar el perfil. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (profile) {
      setEditedName(profile.nombre);
      setEditedAvatarUrl(profile.avatarUrl || "");
    }
    setIsEditing(false);
    setSaveError(null);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden z-50 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Mi Perfil
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">Cargando perfil...</div>
              </div>
            ) : profile ? (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar
                    src={isEditing ? editedAvatarUrl : profile.avatarUrl}
                    alt={profile.nombre}
                    size="xl"
                  />

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil1Icon className="w-4 h-4" />
                      <span>Editar perfil</span>
                    </button>
                  )}
                </div>

                {/* Profile Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profile.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900">{profile.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      El email no se puede modificar
                    </p>
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL del Avatar
                      </label>
                      <input
                        type="url"
                        value={editedAvatarUrl}
                        onChange={(e) => setEditedAvatarUrl(e.target.value)}
                        placeholder="https://ejemplo.com/avatar.png"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                        disabled={isSaving}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Deja vacío para usar el avatar por defecto
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Usuario
                    </label>
                    <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                      {profile.id}
                    </p>
                  </div>
                </div>

                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{saveError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No se pudo cargar el perfil
                </p>
              </div>
            )}
          </div>

          {/* Footer con botones de acción */}
          {isEditing && profile && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editedName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
