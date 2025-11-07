import { getMicroserviceClient } from "../../../config/httpClient";
import type { UpdateProfileData, UserProfile } from "../types/userTypes";

export async function getMyProfile(): Promise<UserProfile> {
  try {
    const response = await getMicroserviceClient("users").get(
      "/api/v1/usuario/me"
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching my profile:", e);
    throw new Error("Error al obtener el perfil del usuario");
  }
}

export async function updateMyProfile(
  profileData: UpdateProfileData
): Promise<UserProfile> {
  try {
    const response = await getMicroserviceClient("users").patch(
      "/api/v1/usuario/me",
      profileData
    );
    return response.data;
  } catch (e) {
    console.error("Error updating profile:", e);
    throw new Error("Error al actualizar el perfil");
  }
}

export async function getUsersBatch(userIds: string[]): Promise<UserProfile[]> {
  try {
    const response = await getMicroserviceClient("users").post(
      "/api/v1/usuario/batch",
      { ids: userIds }
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching users batch:", e);
    throw new Error("Error al obtener perfiles de usuarios");
  }
}
