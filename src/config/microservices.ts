export const MICROSERVICES_CONFIG = {
  users: import.meta.env.VITE_USERS_SERVICE_URL || "http://localhost:5260",
  messages:
    import.meta.env.VITE_MESSAGES_SERVICE_URL || "http://localhost:5233",
  conversations: import.meta.env.VITE_CONVERSATIONS_SERVICE_URL || "http://localhost:5217",
} as const;

export type MicroserviceName = keyof typeof MICROSERVICES_CONFIG;
