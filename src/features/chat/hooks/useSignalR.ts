import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { signalRService } from "../services/signalRService";

const HUB_URL = import.meta.env.PROD
  ? "https://chatapp-mensajes.onrender.com/hubs/mensajes"
  : "/hubs/mensajes";

export function useSignalR() {
  const { isAuthenticated, getAccessToken } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      signalRService.setTokenFactory(async () => {
        const token = await getAccessToken();
        return token;
      });

      signalRService.startConnection(HUB_URL);
    }

    return () => {
      // Optional: Stop connection on unmount or logout
      // signalRService.stopConnection();
    };
  }, [isAuthenticated, getAccessToken]);

  return signalRService;
}
