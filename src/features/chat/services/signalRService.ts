import * as signalR from "@microsoft/signalr";

// Helper to get token from storage since we can't use hook here
const getStoredToken = () => localStorage.getItem("access_token");

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private hubUrl: string;

  constructor() {
    // Determine Hub URL based on environment
    // In production (Vercel), we point directly to Render backend
    // In development, we use relative path to leverage Vite proxy
    const isProd = import.meta.env.PROD;
    this.hubUrl = isProd 
      ? "https://chatapp-mensajes.onrender.com/hubs/mensajes" 
      : "/hubs/mensajes";
  }

  public async startConnection(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: async () => {
          const token = getStoredToken();
          return token || "";
        },
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public getConnection(): signalR.HubConnection | null {
    return this.connection;
  }

  public async joinConversation(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("UnirseAConversacion", conversationId);
      } catch (err) {
        console.error("Error joining conversation:", err);
      }
    }
  }

  public async leaveConversation(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("DejarConversacion", conversationId);
      } catch (err) {
        console.error("Error leaving conversation:", err);
      }
    }
  }

  public async sendTyping(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("Escribiendo", conversationId);
      } catch (err) {
        console.error("Error sending typing status:", err);
      }
    }
  }

  public async sendStopTyping(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("DejoDeEscribir", conversationId);
      } catch (err) {
        console.error("Error sending stop typing status:", err);
      }
    }
  }
}

export const signalRService = new SignalRService();
