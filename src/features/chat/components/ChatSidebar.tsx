import * as Tabs from "@radix-ui/react-tabs";
import type { Conversation } from "../types/chatTypes";

interface ChatSidebarProps {
  groups: Conversation[];
  directConversations: Conversation[];
  isLoading: boolean;
  onSelectChat: (chatId: string, type: "group" | "direct") => void;
  selectedChatId?: string;
}

export function ChatSidebar({
  groups,
  directConversations,
  isLoading,
  onSelectChat,
  selectedChatId,
}: ChatSidebarProps) {
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
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {group.nombre?.charAt(0).toUpperCase() || "G"}
                      </div>
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

          <Tabs.Content value="direct" className="p-2">
            {directConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No tienes conversaciones directas aún</p>
              </div>
            ) : (
              <div className="space-y-1">
                {directConversations.map((conversation) => (
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
                      <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.miembros[0]?.nombre
                          .charAt(0)
                          .toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.miembros[0]?.nombre || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.miembros.length} participantes
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
