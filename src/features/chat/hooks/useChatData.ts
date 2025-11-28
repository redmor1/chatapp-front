import { useState, useEffect } from "react";
import { getConversationsFromAuthenticatedUser } from "../api/conversationApi";
import type { Conversation } from "../types/chatTypes";
import { useAuth } from "../../auth/hooks/useAuth";
import { useSignalR } from "./useSignalR";

export function useChatData() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const signalR = useSignalR();

  // Filtrar conversaciones por tipo
  const groups = conversations.filter((conv) => conv.tipo === "grupo");
  const directConversations = conversations.filter(
    (conv) => conv.tipo === "directo"
  );

  const fetchChatData = async () => {
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
  };

  useEffect(() => {
    fetchChatData();
  }, [isAuthenticated]);

  // Listen for membership changes
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleMembershipChange = (data: any) => {
      console.log("useChatData: Membership changed, refreshing...", data);
      fetchChatData();
    };

    console.log("useChatData: Subscribing to membership events");
    signalR.onYouWereAdded(handleMembershipChange);
    signalR.onYouWereRemoved(handleMembershipChange);

    return () => {
      console.log("useChatData: Unsubscribing from membership events");
      signalR.offYouWereAdded(handleMembershipChange);
      signalR.offYouWereRemoved(handleMembershipChange);
    };
  }, [isAuthenticated, signalR]);

  const refreshConversations = async () => {
    await fetchChatData();
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
