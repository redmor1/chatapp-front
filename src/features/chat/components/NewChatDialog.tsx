import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { createDirectConversation } from "../api/conversationApi";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatCreated?: (chatId: string) => void;
}

export function NewChatDialog({
  open,
  onOpenChange,
  onChatCreated,
}: NewChatDialogProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const conversation = await createDirectConversation({ email: email.trim() });
      onChatCreated?.(conversation.id);
      onOpenChange(false);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar la conversación. Verifica el email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50 focus:outline-none">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
              Nuevo Chat
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-500 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email del usuario
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  "Iniciar Chat"
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
