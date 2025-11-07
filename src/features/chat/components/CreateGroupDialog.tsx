import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { createGroup } from "../api/conversationApi";
import type { CreateGroupData } from "../types/chatTypes";

interface CreateGroupDialogProps {
  onGroupCreated: () => void;
}

export function CreateGroupDialog({ onGroupCreated }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const initialMembersString =
      (formData.get("initialMembers") as string) || "";
    const initialMembers = initialMembersString
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member.length > 0);

    const groupData: CreateGroupData = {
      groupName: formData.get("groupName") as string,
      initialMembers,
    };

    try {
      await createGroup(groupData);
      setOpen(false);
      onGroupCreated();

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError("Error al crear el grupo. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
          Crear Grupo
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md p-6 data-[state=open]:animate-slideIn">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Crear Nuevo Grupo
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                Crea un grupo para chatear con múltiples personas
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Grupo
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                required
                placeholder="Ej: Equipo de Desarrollo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="initialMembers"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Miembros Iniciales
              </label>
              <input
                type="text"
                id="initialMembers"
                name="initialMembers"
                placeholder="IDs de usuarios separados por comas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional: Ingresa los IDs de los usuarios separados por comas
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creando..." : "Crear Grupo"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
