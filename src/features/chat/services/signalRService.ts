import * as signalR from "@microsoft/signalr";

type MessageHandler = (message: any) => void;
type ReadHandler = (info: any) => void;
type TypingHandler = (data: { conversacionId: string; usuario: string }) => void;
type MembershipHandler = (data: any) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private tokenFactory: (() => Promise<string | undefined>) | null = null;

  public setTokenFactory(factory: () => Promise<string | undefined>) {
    this.tokenFactory = factory;
  }

  public async startConnection(hubUrl: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: async () => {
          if (this.tokenFactory) {
            const token = await this.tokenFactory();
            return token || "";
          }
          return "";
        },
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      setTimeout(() => this.startConnection(hubUrl), 5000);
    }
  }

  public async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  public getConnection(): signalR.HubConnection | null {
    return this.connection;
  }

  // --- Methods (Invoke) ---

  public async joinConversation(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("UnirseAConversacion", conversationId);
    }
  }

  public async leaveConversation(conversationId: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("DejarConversacion", conversationId);
    }
  }

  public async sendTyping(conversationId: string, username: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("Escribiendo", conversationId, username);
    }
  }

  public async sendStopTyping(conversationId: string, username: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("DejoDeEscribir", conversationId, username);
    }
  }

  // --- Events (On/Off) ---

  public onMessageReceived(callback: MessageHandler) {
    this.connection?.on("NuevoMensaje", callback);
  }

  public offMessageReceived(callback: MessageHandler) {
    this.connection?.off("NuevoMensaje", callback);
  }

  public onMessageRead(callback: ReadHandler) {
    this.connection?.on("MensajeLeido", callback);
  }

  public offMessageRead(callback: ReadHandler) {
    this.connection?.off("MensajeLeido", callback);
  }

  public onUserTyping(callback: TypingHandler) {
    this.connection?.on("UsuarioEscribiendo", callback);
  }

  public offUserTyping(callback: TypingHandler) {
    this.connection?.off("UsuarioEscribiendo", callback);
  }

  public onUserStoppedTyping(callback: TypingHandler) {
    this.connection?.on("UsuarioDejoDeEscribir", callback);
  }

  public offUserStoppedTyping(callback: TypingHandler) {
    this.connection?.off("UsuarioDejoDeEscribir", callback);
  }

  // Membership Events
  public onUserAdded(callback: MembershipHandler) {
    this.connection?.on("UsuarioAgregado", callback);
  }

  public offUserAdded(callback: MembershipHandler) {
    this.connection?.off("UsuarioAgregado", callback);
  }

  public onUserRemoved(callback: MembershipHandler) {
    this.connection?.on("UsuarioEliminado", callback);
  }

  public offUserRemoved(callback: MembershipHandler) {
    this.connection?.off("UsuarioEliminado", callback);
  }

  public onYouWereAdded(callback: MembershipHandler) {
    this.connection?.on("TeHanAgregado", callback);
  }

  public offYouWereAdded(callback: MembershipHandler) {
    this.connection?.off("TeHanAgregado", callback);
  }

  public onYouWereRemoved(callback: MembershipHandler) {
    this.connection?.on("TeHanEliminado", callback);
  }

  public offYouWereRemoved(callback: MembershipHandler) {
    this.connection?.off("TeHanEliminado", callback);
  }
}

export const signalRService = new SignalRService();
