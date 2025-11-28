import { useState, useEffect, useRef } from "react";
import {
  getMessagesFromConversation,
  sendMessage as sendMessageApi,
  markMessageAsRead as markMessageAsReadApi,
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

  // Cargar historial inicial
  useEffect(() => {
    if (!conversationId || !chatType) {
      setMessages([]);
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
            (a, b) =>
              new Date(a.fechaCreacion).getTime() -
              new Date(b.fechaCreacion).getTime()
          )
        );
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
        // Si el mensaje no es mío, marcarlo como leído (opcional, depende de UX)
        // if (message.autorId !== user?.id) {
        //   markAsRead(message.id);
        // }
      }
    };

    const handleMessageRead = (info: {
      mensajeId: string;
      usuarioId: string;
      fecha: string;
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === info.mensajeId) {
            return {
              ...msg,
              leidoPor: [...(msg.leidoPor || []), info.usuarioId],
            };
          }
          return msg;
        })
      );
    };

    signalR.joinConversation(conversationId);
    signalR.onMessageReceived(handleNewMessage);
    signalR.onMessageRead(handleMessageRead);

    return () => {
      signalR.leaveConversation(conversationId);
      signalR.offMessageReceived(handleNewMessage);
      signalR.offMessageRead(handleMessageRead);
    };
  }, [conversationId, signalR, user?.id]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !chatType) return;
    try {
      await sendMessageApi(conversationId, content, chatType);
      // No agregamos el mensaje manualmente aquí porque esperamos el evento de SignalR
      // para confirmar que se guardó y mantener consistencia.
      // Opcionalmente podríamos agregarlo con estado "enviando".
    } catch (err) {
      console.error(err);
      setError("Error al enviar mensaje");
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await markMessageAsReadApi(messageId);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    messagesEndRef,
  };
}
