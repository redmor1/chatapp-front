import { getMicroserviceClient } from "../../../config/httpClient";
import type { Message } from "../types/chatTypes";

export async function getDirectConversationsFromAuthenticatedUser() {
  try {
    // TODO: Placeholder - implementar endpoint real si es diferente al de conversaciones
    const response = await getMicroserviceClient("messages").get(
      "/api/v1/conversaciones/"
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error fetching direct conversations for authenticated user");
  }
}

export async function getMessagesFromConversation(
  conversationId: string,
  type: "grupo" | "directo",
  limit: number = 50,
  before?: string
): Promise<Message[]> {
  try {
    const params: any = { limit, tipo: type };
    if (before) {
      params.before = before;
    }

    const response = await getMicroserviceClient("messages").get(
      `/api/v1/conversaciones/${conversationId}/mensajes`,
      { params }
    );
    // El backend devuelve { mensajes: [], nextCursor: ... }
    // Ajustamos para devolver solo el array de mensajes por ahora
    return response.data.mensajes || [];
  } catch (e) {
    console.error(e);
    throw Error("Error fetching messages from conversation");
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: "grupo" | "directo"
): Promise<void> {
  try {
    await getMicroserviceClient("messages").post(
      `/api/v1/conversaciones/${conversationId}/mensajes`,
      { contenido: content },
      { params: { tipo: type } }
    );
  } catch (e) {
    console.error(e);
    throw Error("Error sending message");
  }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    await getMicroserviceClient("messages").patch(
      `/api/v1/mensajes/${messageId}/lectura`,
      {}
    );
  } catch (e) {
    console.error(e);
    throw Error("Error marking message as read");
  }
}
