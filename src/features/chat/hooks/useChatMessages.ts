import { useState, useEffect, useRef } from "react";
import {
  getMessagesFromConversation,
  sendMessage as sendMessageApi,
  markConversationAsRead as markMessageAsReadApi,
} from "../api/messagesApi";
import type { Message } from "../types/chatTypes";
import { useSignalR } from "./useSignalR";
import { useAuth } from "../../auth/hooks/useAuth";

export function useChatMessages(
  conversationId?: string,
  chatType?: "grupo" | "directo"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signalR = useSignalR();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markAsRead = async () => {
    if (!conversationId) return;
    try {
      await markMessageAsReadApi(conversationId);
    } catch (err) {
      console.error(err);
    }
  };

  // Cargar historial inicial
  useEffect(() => {
    if (!conversationId || !chatType) {
      setMessages([]);
      setTypingUsers(new Set());
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const history = await getMessagesFromConversation(
          conversationId,
          chatType
        );
        // Ordenar por fecha ascendente (el backend suele devolver descendente para paginación)
        setMessages(
          history.sort(
            (a: Message, b: Message) =>
              new Date(a.fechaCreacion).getTime() -
              new Date(b.fechaCreacion).getTime()
          )
        );
        
        // Marcar como leídos al entrar
        markAsRead();
      } catch (err) {
        console.error(err);
        setError("Error al cargar mensajes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, chatType]);

  // Suscripción a SignalR
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversacionId === conversationId) {
        setMessages((prev) => [...prev, message]);
        // Si el mensaje llega y estoy en la conversación, marcar como leído
        if (message.autorId !== user?.id) {
           markAsRead();
        }
      }
    };

    const handleMessagesRead = (info: {
      conversacionId: string;
      mensajeIds: string[];
      usuarioId: string;
      fecha: string;
    }) => {
      if (info.conversacionId !== conversationId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (info.mensajeIds.includes(msg.id)) {
            // Avoid duplicates in leidoPor
            const currentLeidoPor = msg.leidoPor || [];
            if (!currentLeidoPor.includes(info.usuarioId)) {
               return {
                ...msg,
                leidoPor: [...currentLeidoPor, info.usuarioId],
              };
            }
          }
          return msg;
        })
      );
    };

    const handleUserTyping = (data: { conversacionId: string; usuario: string }) => {
      if (data.conversacionId === conversationId && data.usuario !== user?.name) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.add(data.usuario);
          return newSet;
        });
      }
    };

    const handleUserStoppedTyping = (data: { conversacionId: string; usuario: string }) => {
      if (data.conversacionId === conversationId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.usuario);
          return newSet;
        });
      }
    };

    signalR.joinConversation(conversationId);
    signalR.onMessageReceived(handleNewMessage);
    signalR.onMessagesRead(handleMessagesRead);
    signalR.onUserTyping(handleUserTyping);
    signalR.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      signalR.leaveConversation(conversationId);
      signalR.offMessageReceived(handleNewMessage);
      signalR.offMessagesRead(handleMessagesRead);
      signalR.offUserTyping(handleUserTyping);
      signalR.offUserStoppedTyping(handleUserStoppedTyping);
    };
  }, [conversationId, signalR, user?.id, user?.name]);

  const handleTyping = () => {
    if (!conversationId || !user?.name) return;

    // Clear existing timeout to reset the "stop typing" timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      // If no timeout exists, it means we weren't typing before (or timeout expired), so send "Typing"
      signalR.sendTyping(conversationId, user.name);
    }

    // Set a new timeout to send "Stop Typing" after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      signalR.sendStopTyping(conversationId, user.name);
      typingTimeoutRef.current = null;
    }, 3000);
  };

  const sendMessage = async (content: string) => {
    if (!conversationId || !chatType) return;
    
    // Clear typing status immediately when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      if (user?.name) {
        signalR.sendStopTyping(conversationId, user.name);
      }
    }

    try {
      await sendMessageApi(conversationId, content, chatType);
    } catch (err) {
      console.error(err);
      setError("Error al enviar mensaje");
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    messagesEndRef,
    typingUsers: Array.from(typingUsers),
    handleTyping,
  };
}
