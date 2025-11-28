import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useCallback } from "react";
import {
  getConversationMembers,
  addMemberToConversation,
  removeMemberFromConversation,
} from "../api/conversationApi";
import type { UsuarioResumen } from "../types/chatTypes";
import { Avatar } from "../../../shared/components/Avatar";

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatId: string;
  chatName?: string;
}

export function GroupDetailsDialog({
  open,
  onOpenChange,
  chatId,
}: GroupDetailsDialogProps) {
  const [members, setMembers] = useState<UsuarioResumen[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!chatId) return;

    setLoadingMembers(true);
    try {
      const membersData = await getConversationMembers(chatId);
      setMembers(membersData);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoadingMembers(false);
    }
  }, [chatId]);

  // Cargar miembros cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadMembers();
    }
  }, [open, loadMembers]);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!chatId || !newMemberId.trim()) return;

    setIsAddingMember(true);
    setAddMemberError(null);

    try {
      await addMemberToConversation(chatId, newMemberId.trim());
      setNewMemberId("");
      await loadMembers(); // Recargar la lista
    } catch (error) {
      console.error("Error adding member:", error);
      setAddMemberError("No se pudo agregar el miembro. Verifica el ID.");
    } finally {
      setIsAddingMember(false);
    }
  }

  async function handleRemoveMember(memberId: string, memberName: string) {
    if (!chatId) return;

    if (
      !window.confirm(
        `¿Estás seguro de que deseas remover a ${memberName} del grupo?`
      )
    ) {
      return;
    }

    try {
      await removeMemberFromConversation(chatId, memberId);
      await loadMembers(); // Recargar la lista
    } catch (error) {
      console.error("Error removing member:", error);
      alert("No se pudo remover el miembro. Verifica que tengas permisos.");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden z-50 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Detalles del grupo
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Miembros ({members.length})
            </h3>
            {loadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-500">
                  Cargando miembros...
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={member.avatarUrl}
                        alt={member.nombre}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.nombre}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveMember(member.id, member.nombre)
                      }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover del grupo"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Agregar miembro
            </h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  placeholder="Email del usuario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                  disabled={isAddingMember}
                />
              </div>
              {addMemberError && (
                <p className="text-xs text-red-600">{addMemberError}</p>
              )}
              <button
                type="submit"
                disabled={isAddingMember || !newMemberId.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>
                  {isAddingMember ? "Agregando..." : "Agregar miembro"}
                </span>
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
