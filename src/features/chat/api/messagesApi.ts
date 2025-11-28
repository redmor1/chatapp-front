import { getMicroserviceClient } from "../../../config/httpClient";

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
) {
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
) {
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

export async function markConversationAsRead(conversationId: string) {
  try {
    await getMicroserviceClient("messages").patch(
      `/api/v1/conversaciones/${conversationId}/lectura`,
      {}
    );
  } catch (e) {
    console.error(e);
    throw Error("Error marking conversation as read");
  }
}
