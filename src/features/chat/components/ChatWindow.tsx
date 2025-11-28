import { useState, useEffect } from "react";
import { deleteConversation, getConversationById } from "../api/conversationApi";
import { GroupDetailsDialog } from "./GroupDetailsDialog";
import { Avatar } from "../../../shared/components/Avatar";
import { useChatMessages } from "../hooks/useChatMessages";
import { useAuth } from "../../auth/hooks/useAuth";
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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState<UsuarioResumen[]>([]);
  
  const {
    messages,
    isLoading,
    sendMessage,
    messagesEndRef,
    typingUsers,
    handleTyping,
  } = useChatMessages(chatId, chatType === "group" ? "grupo" : "directo");
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef, typingUsers]);

  // Fetch members to show avatars
  useEffect(() => {
    if (chatId) {
      getConversationById(chatId)
        .then((conv) => {
          if (conv && conv.miembros) {
            setMembers(conv.miembros);
          }
        })
        .catch((err) => console.error("Error fetching members for avatars:", err));
    } else {
      setMembers([]);
    }
  }, [chatId]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(""); // Clear input immediately for better UX
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

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
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={
              chatType === "group" ? () => setShowDetailsDialog(true) : undefined
            }
            className={`flex items-center space-x-3 flex-1 ${
              chatType === "group"
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "cursor-default"
            }`}
            disabled={chatType !== "group"}
          >
            <Avatar src={undefined} alt={chatName || "Chat"} size="md" />
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

      {/* Group Details Dialog */}
      {chatType === "group" && chatId && (
        <GroupDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          chatId={chatId}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No hay mensajes aún. ¡Di hola!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = msg.autorId === user?.id;
                const isRead = msg.leidoPor && msg.leidoPor.length > 0;
                const author = members.find((m) => m.id === msg.autorId);
                
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMyMessage ? "justify-end" : "justify-start"
                    } items-end space-x-2`}
                  >
                    {!isMyMessage && (
                      <Avatar
                        src={author?.avatarUrl}
                        alt={author?.nombre || "User"}
                        size="sm"
                        className="mb-1"
                      />
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isMyMessage
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.contenido}</p>
                      <div
                        className={`flex items-center justify-end space-x-1 mt-1`}
                      >
                        <p
                          className={`text-[10px] ${
                            isMyMessage ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.fechaCreacion).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {isMyMessage && (
                          <span className="text-blue-100 text-xs">
                            {isRead ? (
                              // Double check (leído)
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              // Single check (enviado)
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3 opacity-70"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-gray-100 rounded-lg rounded-bl-none px-4 py-2 text-xs text-gray-500 italic">
                  {typingUsers.join(", ")} {typingUsers.length === 1 ? "está" : "están"} escribiendo...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="flex items-end space-x-2">
          <textarea
            placeholder="Escribe un mensaje..."
            rows={1}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
