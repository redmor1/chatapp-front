// Tipos basados en la API de Usuarios (OpenAPI spec)

export interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string | null;
}

export interface UpdateProfileData {
  nombre?: string;
  avatarUrl?: string | null;
}
