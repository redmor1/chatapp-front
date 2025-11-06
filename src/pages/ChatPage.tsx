import { useState } from "react";
import { useChatData } from "../features/chat/hooks/useChatData";
import { ChatSidebar } from "../features/chat/components/ChatSidebar";
import { ChatWindow } from "../features/chat/components/ChatWindow";
import { CreateGroupDialog } from "../features/chat/components/CreateGroupDialog";
import { BackendStatus } from "../shared/components/BackendStatus";
import { LogoutButton } from "../features/auth/components/LogoutButton";

function ChatPage() {
  const {
    groups,
    directConversations,
    isLoading,
    error,
    refreshConversations,
  } = useChatData();
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    type: "group" | "direct";
    name: string;
  } | null>(null);

  const handleSelectChat = (chatId: string, type: "group" | "direct") => {
    let chatName = "";

    if (type === "group") {
      const group = groups.find((g) => g.id === chatId);
      chatName = group?.nombre || "Grupo sin nombre";
    } else {
      const conversation = directConversations.find((c) => c.id === chatId);
      chatName = conversation?.miembros[0]?.nombre || "Usuario";
    }

    setSelectedChat({ id: chatId, type, name: chatName });
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ChatApp</h1>
            <p className="text-sm text-gray-500">Mensajería en tiempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <BackendStatus />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
              onClick={() => {
                // TODO: Implementar diálogo para iniciar chat directo
                alert("Funcionalidad de mensaje directo - próximamente");
              }}
            >
              Mensaje Directo
            </button>
            <CreateGroupDialog onGroupCreated={refreshConversations} />
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          groups={groups}
          directConversations={directConversations}
          isLoading={isLoading}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?.id}
        />
        <ChatWindow
          chatId={selectedChat?.id}
          chatType={selectedChat?.type}
          chatName={selectedChat?.name}
        />
      </div>
    </div>
  );
}

export default ChatPage;
