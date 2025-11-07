import { useState, useEffect } from "react";
import { getConversationsFromAuthenticatedUser } from "../api/conversationApi";
import type { Conversation } from "../types/chatTypes";
import { useAuth } from "../../auth/hooks/useAuth";

export function useChatData() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Filtrar conversaciones por tipo
  const groups = conversations.filter((conv) => conv.tipo === "grupo");
  const directConversations = conversations.filter(
    (conv) => conv.tipo === "directo"
  );

  useEffect(() => {
    async function fetchChatData() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const conversationsData = await getConversationsFromAuthenticatedUser();
        setConversations(conversationsData || []);
      } catch (err) {
        setError("Error loading chat data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatData();
  }, [isAuthenticated]);

  const refreshConversations = async () => {
    try {
      const conversationsData = await getConversationsFromAuthenticatedUser();
      setConversations(conversationsData || []);
    } catch (err) {
      console.error("Error refreshing conversations:", err);
    }
  };

  return {
    conversations,
    groups,
    directConversations,
    isLoading,
    error,
    refreshConversations,
  };
}
