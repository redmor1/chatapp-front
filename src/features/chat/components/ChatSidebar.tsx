import * as Tabs from "@radix-ui/react-tabs";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Conversation } from "../types/chatTypes";
import { Avatar } from "../../../shared/components/Avatar";
import { useAuth } from "../../auth/hooks/useAuth";
import { NewChatDialog } from "./NewChatDialog";

interface ChatSidebarProps {
  groups: Conversation[];
  directConversations: Conversation[];
  isLoading: boolean;
  onSelectChat: (chatId: string, type: "group" | "direct") => void;
  selectedChatId?: string;
  onRefresh?: () => void;
}

export function ChatSidebar({
  groups,
  directConversations,
  isLoading,
  onSelectChat,
  selectedChatId,
  onRefresh,
}: ChatSidebarProps) {
  const { user } = useAuth();
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="w-80 border-r border-gray-200 bg-white p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleChatCreated = (chatId: string) => {
    onRefresh?.();
    onSelectChat(chatId, "direct");
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <Tabs.Root defaultValue="groups" className="flex flex-col h-full">
        <div className="border-b border-gray-200">
          <Tabs.List className="flex bg-gray-50">
            <Tabs.Trigger
              value="groups"
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            >
              Grupos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="direct"
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            >
              Directos
            </Tabs.Trigger>
          </Tabs.List>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs.Content value="groups" className="p-2">
            {groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No tienes grupos aún</p>
              </div>
            ) : (
              <div className="space-y-1">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => onSelectChat(group.id, "group")}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                      selectedChatId === group.id
                        ? "bg-blue-50 border border-blue-200"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={group.avatarUrl || undefined}
                        alt={group.nombre || "Grupo"}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {group.nombre || "Grupo sin nombre"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {group.miembros.length} miembros
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="direct" className="p-2 h-full flex flex-col">
            <div className="mb-2">
              <button
                onClick={() => setShowNewChatDialog(true)}
                className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nuevo Chat</span>
              </button>
            </div>
            
            {directConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No tienes conversaciones directas aún</p>
              </div>
            ) : (
              <div className="space-y-1">
                {directConversations.map((conversation) => {
                  // Find the other user
                  const otherUser = conversation.miembros.find(
                    (m) => m.id !== user?.id
                  ) || conversation.miembros[0]; // Fallback if something is weird

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => onSelectChat(conversation.id, "direct")}
                      className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedChatId === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={otherUser?.avatarUrl || undefined}
                          alt={otherUser?.nombre || "Usuario"}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {otherUser?.nombre || "Usuario"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.miembros.length === 2 ? "Privado" : `${conversation.miembros.length} participantes`}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
}
