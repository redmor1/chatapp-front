import { getMicroserviceClient } from "../../../config/httpClient";
import type { CreateGroupData } from "../types/chatTypes";

/**
 * Obtiene todas las conversaciones (grupos y directos) del usuario autenticado
 * GET /api/v1/conversacion/
 */
export async function getConversationsFromAuthenticatedUser() {
  try {
    const response = await getMicroserviceClient("conversations").get(
      "/api/v1/conversacion/"
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error fetching conversations for authenticated user");
  }
}

/**
 * Crea un nuevo grupo
 * POST /api/v1/conversacion/grupo
 */
export async function createGroup(groupData: CreateGroupData) {
  try {
    const response = await getMicroserviceClient("conversations").post(
      "/api/v1/conversacion/grupo",
      {
        nombre: groupData.groupName,
        miembrosIniciales: groupData.initialMembers,
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw Error("Error creating group");
  }
}

/**
 * Inicia o recupera un chat directo con otro usuario
 * POST /api/v1/conversacion/directo
 */
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
    console.error(e);
    throw Error("Error starting direct chat");
  }
}
