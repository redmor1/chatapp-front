import { getMicroserviceClient } from "../../../config/httpClient";

export async function getDirectConversationsFromAuthenticatedUser() {
  try {
    // TODO: Placeholder - implementar endpoint real
    const response = await getMicroserviceClient("messages").get(
      "/api/v1/conversaciones/"
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error fetching direct conversations for authenticated user");
  }
}

export async function getMessagesFromConversation(conversationId: string) {
  try {
    // TODO: Placeholder - implementar endpoint real
    const response = await getMicroserviceClient("messages").get(
      `/api/v1/conversaciones/${conversationId}/mensajes`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error fetching messages from conversation");
  }
}
