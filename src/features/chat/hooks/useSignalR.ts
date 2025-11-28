import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { signalRService } from "../services/signalRService";

const HUB_URL = "/hubs/mensajes"; // Use relative path to go through Vite proxy

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
