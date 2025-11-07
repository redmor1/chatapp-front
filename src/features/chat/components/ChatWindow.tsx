import { useState } from "react";
import {
  deleteConversation,
  getConversationMembers,
  addMemberToConversation,
  removeMemberFromConversation,
} from "../api/conversationApi";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Cross2Icon,
  PersonIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { UsuarioResumen } from "../types/chatTypes";

interface ChatWindowProps {
  chatId?: string;
  chatType?: "group" | "direct";
  chatName?: string;
  onGroupDeleted?: () => void;
}

export function ChatWindow({
  chatId,
  chatType,
  chatName,
  onGroupDeleted,
}: ChatWindowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [members, setMembers] = useState<UsuarioResumen[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [newMemberId, setNewMemberId] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  async function loadMembers() {
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
  }

  async function handleOpenMembersDialog() {
    setShowMembersDialog(true);
    await loadMembers();
  }

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

  async function handleDeleteGroup() {
    if (!chatId) return;

    // Confirmación antes de eliminar
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el grupo "${chatName}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteConversation(chatId);
      // Notificar al padre que el grupo fue eliminado
      onGroupDeleted?.();
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting group:", error);
      setDeleteError(
        "No se pudo eliminar el grupo. Por favor intenta de nuevo."
      );
      setIsDeleting(false);
    }
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Selecciona una conversación
          </h3>
          <p className="text-gray-500 text-sm">
            Elige un grupo o conversación directa para comenzar a chatear
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={chatType === "group" ? handleOpenMembersDialog : undefined}
            className={`flex items-center space-x-3 flex-1 ${
              chatType === "group"
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-default"
            }`}
            disabled={chatType !== "group"}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                chatType === "group"
                  ? "bg-linear-to-br from-blue-500 to-blue-600"
                  : "bg-linear-to-br from-green-500 to-green-600"
              }`}
            >
              {chatName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-semibold text-gray-900">
                {chatName || "Chat"}
              </h2>
              <p className="text-xs text-gray-500">
                {chatType === "group"
                  ? "Grupo • Click para ver miembros"
                  : "Conversación directa"}
              </p>
            </div>
          </button>
          {chatType === "group" && (
            <div className="flex flex-col items-end space-y-2">
              {deleteError && (
                <p className="text-xs text-red-600 max-w-xs text-right">
                  {deleteError}
                </p>
              )}
              <button
                onClick={handleDeleteGroup}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Eliminando..." : "Eliminar grupo"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Members Dialog */}
      {chatType === "group" && (
        <Dialog.Root
          open={showMembersDialog}
          onOpenChange={setShowMembersDialog}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden z-50 flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Miembros del grupo
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Cross2Icon className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
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
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                            {member.avatarUrl ? (
                              <img
                                className="w-full h-full object-cover"
                                src={member.avatarUrl}
                                alt={member.nombre}
                              />
                            ) : (
                              <PersonIcon className="w-5 h-5" />
                            )}
                          </div>
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
                      type="text"
                      value={newMemberId}
                      onChange={(e) => setNewMemberId(e.target.value)}
                      placeholder="ID del usuario"
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
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {/* Placeholder para mensajes */}
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Los mensajes aparecerán aquí
            </p>
            <p className="text-xs text-gray-400 mt-2">Chat ID: {chatId}</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end space-x-2">
          <textarea
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
