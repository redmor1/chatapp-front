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
  limit: number = 50,
  before?: string
): Promise<Message[]> {
  try {
    const params: any = { limit };
    if (before) {
      params.before = before;
    }

    const response = await getMicroserviceClient("messages").get(
      `/api/v1/conversaciones/${conversationId}/mensajes`,
      { params }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error fetching messages from conversation");
  }
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<void> {
  try {
    await getMicroserviceClient("messages").post(
      `/api/v1/conversaciones/${conversationId}/mensajes`,
      { contenido: content }
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
