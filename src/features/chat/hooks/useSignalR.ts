import { useEffect, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { signalRService } from "../services/signalRService";

export function useSignalR() {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    // Initialize connection
    const conn = signalRService.getConnection();
    if (conn) {
      setConnection(conn);
    }

    // Subscribe to connection changes if needed, 
    // but for now we just return the singleton connection
  }, []);

  return { connection };
}
