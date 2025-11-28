// Tipos basados en la API de Conversaciones

export interface UsuarioResumen {
  id: string;
  nombre: string;
  avatarUrl?: string | null;
}

export interface Conversation {
  id: string;
  tipo: "directo" | "grupo";
  nombre?: string | null;
  avatarUrl?: string | null;
  miembros: UsuarioResumen[];
}

export interface Message {
  id: string;
  conversacionId: string;
  autorId: string;
  contenido: string;
  fechaCreacion: string;
  leidoPor: string[];
}

export type ChatTab = "groups" | "direct";

export interface CreateGroupData {
  groupName: string;
  initialMembers: string[];
  avatarUrl?: string;
}
