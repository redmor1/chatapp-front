import { getMicroserviceClient } from "../../../config/httpClient";
import type { CreateGroupData } from "../types/chatTypes";

export async function getConversationsFromAuthenticatedUser() {
  try {
    const response = await getMicroserviceClient("conversations").get(
      "/api/v1/conversacion/"
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching conversations:", e);
    throw new Error("Error fetching conversations for authenticated user");
  }
}

export async function createGroup(groupData: CreateGroupData) {
  try {
    const response = await getMicroserviceClient("conversations").post(
      "/api/v1/conversacion/grupo",
      {
        nombre: groupData.groupName,
        miembrosIniciales: groupData.initialMembers, // Ahora son emails
        emailsIniciales: groupData.initialMembers, // Enviar como emails si el backend lo requiere así, o mantener miembrosIniciales si el backend es polimórfico
      }
    );
    return response.data;
  } catch (e) {
    console.error("Error creating group:", e);
    throw new Error("Error creating group");
  }
}

export async function startDirectChat(otherUserId: string) {
  try {
    const response = await getMicroserviceClient("conversations").post(
      "/api/v1/conversacion/directo",
      {
        otroUsuarioId: otherUserId,
      }
    );
    return response.data;
  } catch (e) {
    console.error("Error starting direct chat:", e);
    throw new Error("Error starting direct chat");
  }
}

export async function getConversationById(conversacionId: string) {
  try {
    const response = await getMicroserviceClient("conversations").get(
      `/api/v1/conversacion/${conversacionId}`
    );
    return response.data;
  } catch (e) {
    console.error(`Error fetching conversation ${conversacionId}:`, e);
    throw new Error("Error fetching conversation details");
  }
}

export async function updateConversation(
  conversacionId: string,
  updateData: {
    nombre?: string;
    avatarUrl?: string | null;
  }
) {
  try {
    const response = await getMicroserviceClient("conversations").put(
      `/api/v1/conversacion/${conversacionId}`,
      updateData
    );
    return response.data;
  } catch (e) {
    console.error(`Error updating conversation ${conversacionId}:`, e);
    throw new Error("Error updating conversation");
  }
}

export async function deleteConversation(conversacionId: string) {
  try {
    await getMicroserviceClient("conversations").delete(
      `/api/v1/conversacion/${conversacionId}`
    );
    return { success: true };
  } catch (e) {
    console.error(`Error deleting conversation ${conversacionId}:`, e);
    throw new Error("Error deleting conversation");
  }
}

export async function getConversationMembers(conversacionId: string) {
  try {
    const response = await getMicroserviceClient("conversations").get(
      `/api/v1/conversacion/${conversacionId}/miembros`
    );
    return response.data;
  } catch (e) {
    console.error(
      `Error fetching members for conversation ${conversacionId}:`,
      e
    );
    throw new Error("Error fetching conversation members");
  }
}

export async function addMemberToConversation(
  conversacionId: string,
  identifier: { usuarioId?: string; email?: string }
) {
  try {
    const response = await getMicroserviceClient("conversations").post(
      `/api/v1/conversacion/${conversacionId}/miembros`,
      identifier
    );
    return response.data;
  } catch (e) {
    console.error(`Error adding member to conversation ${conversacionId}:`, e);
    throw new Error("Error adding member to conversation");
  }
}

export async function createDirectConversation(identifier: {
  usuarioId?: string;
  email?: string;
}) {
  try {
    const response = await getMicroserviceClient("conversations").post(
      "/api/v1/conversacion/directo",
      identifier
    );
    return response.data;
  } catch (e) {
    console.error("Error creating direct conversation:", e);
    throw new Error("Error creating direct conversation");
  }
}

export async function removeMemberFromConversation(
  conversacionId: string,
  usuarioId: string
) {
  try {
    await getMicroserviceClient("conversations").delete(
      `/api/v1/conversacion/${conversacionId}/miembros/${usuarioId}`
    );
    return { success: true };
  } catch (e) {
    console.error(
      `Error removing member from conversation ${conversacionId}:`,
      e
    );
    throw new Error("Error removing member from conversation");
  }
}
