export const MICROSERVICES_CONFIG = {
  users:
    import.meta.env.VITE_USERS_SERVICE_URL ||
    "https://chatapp-gaa9.onrender.com",
  messages:
    import.meta.env.VITE_MESSAGES_SERVICE_URL ||
    "https://messages-service.onrender.com",
  groups:
    import.meta.env.VITE_GROUPS_SERVICE_URL ||
    "https://groups-service.onrender.com",
} as const;

export type MicroserviceName = keyof typeof MICROSERVICES_CONFIG;
