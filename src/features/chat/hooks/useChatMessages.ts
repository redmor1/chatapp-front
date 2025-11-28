import { useState, useEffect, useRef, useCallback } from "react";
import {
  getMessagesFromConversation,
  sendMessage as sendMessageApi,
  markMessageAsRead,
} from "../api/messagesApi";
import type { Message } from "../types/chatTypes";
import { useSignalR } from "./useSignalR";
import { useAuth } from "../../auth/hooks/useAuth";
import { signalRService } from "../services/signalRService";

export function useChatMessages(
  chatId: string | undefined,
  chatType: "grupo" | "directo" | undefined
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { connection } = useSignalR();
  const { user } = useAuth();

  // Load initial messages
  useEffect(() => {
    if (!chatId || !chatType) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const data = await getMessagesFromConversation(chatId, chatType);
        // Ensure messages are sorted by date
        const sortedMessages = data.sort(
          (a: Message, b: Message) =>
            new Date(a.fechaCreacion).getTime() -
            new Date(b.fechaCreacion).getTime()
        );
        setMessages(sortedMessages);
      } catch (err) {
        console.error(err);
        setError("Error loading messages");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [chatId, chatType]);

  // Handle SignalR events
  useEffect(() => {
    if (!connection || !chatId) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversacionId === chatId) {
        setMessages((prev) => [...prev, message]);
        
        // If message is not from me, mark as read
        if (message.autorId !== user?.id) {
            markMessageAsRead(message.id).catch(console.error);
        }
      }
    };

    const handleMessageRead = (messageId: string, userId: string) => {
        setMessages((prev) =>
            prev.map((msg) => {
                if (msg.id === messageId) {
                    const leidoPor = msg.leidoPor || [];
                    if (!leidoPor.includes(userId)) {
                        return { ...msg, leidoPor: [...leidoPor, userId] };
                    }
                }
                return msg;
            })
        );
    };

    const handleUserTyping = (conversationId: string, userId: string, userName: string) => {
        if (conversationId === chatId && userId !== user?.id) {
            setTypingUsers(prev => {
                if (!prev.includes(userName)) return [...prev, userName];
                return prev;
            });
        }
    };

    const handleUserStoppedTyping = (conversationId: string, _userId: string, userName: string) => {
        if (conversationId === chatId) {
            setTypingUsers(prev => prev.filter(name => name !== userName));
        }
    };

    connection.on("NuevoMensaje", handleNewMessage);
    connection.on("MensajeLeido", handleMessageRead);
    connection.on("UsuarioEscribiendo", handleUserTyping);
    connection.on("UsuarioDejoDeEscribir", handleUserStoppedTyping);

    // Join the conversation group
    signalRService.joinConversation(chatId);

    return () => {
      connection.off("NuevoMensaje", handleNewMessage);
      connection.off("MensajeLeido", handleMessageRead);
      connection.off("UsuarioEscribiendo", handleUserTyping);
      connection.off("UsuarioDejoDeEscribir", handleUserStoppedTyping);
      signalRService.leaveConversation(chatId);
    };
  }, [connection, chatId, user?.id]);

  const sendMessage = async (content: string) => {
    if (!chatId || !chatType) return;
    try {
      await sendMessageApi(chatId, content, chatType);
      // Optimistic update could go here, but we rely on SignalR for now
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleTyping = useCallback(() => {
      if (!chatId) return;

      signalRService.sendTyping(chatId);

      if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
          signalRService.sendStopTyping(chatId);
      }, 3000);
  }, [chatId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    messagesEndRef,
    typingUsers,
    handleTyping
  };
}
