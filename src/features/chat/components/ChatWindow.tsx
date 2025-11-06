interface ChatWindowProps {
  chatId?: string;
  chatType?: "group" | "direct";
  chatName?: string;
}

export function ChatWindow({ chatId, chatType, chatName }: ChatWindowProps) {
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
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              chatType === "group"
                ? "bg-linear-to-br from-blue-500 to-blue-600"
                : "bg-linear-to-br from-green-500 to-green-600"
            }`}
          >
            {chatName?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {chatName || "Chat"}
            </h2>
            <p className="text-xs text-gray-500">
              {chatType === "group" ? "Grupo" : "Conversación directa"}
            </p>
          </div>
        </div>
      </div>

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
