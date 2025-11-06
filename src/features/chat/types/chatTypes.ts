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
  contenido: string;
  autor: string;
  timestamp: string;
}

export type ChatTab = "groups" | "direct";

export interface CreateGroupData {
  groupName: string;
  initialMembers: string[];
}
