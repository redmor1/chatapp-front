import axios from "axios";
import type { AxiosInstance } from "axios";
import type { MicroserviceName } from "./microservices";
import { MICROSERVICES_CONFIG } from "./microservices";

const clients = new Map<MicroserviceName, AxiosInstance>();

let tokenProvider: (() => Promise<string | undefined>) | null = null;

export function setTokenProvider(provider: () => Promise<string | undefined>) {
  tokenProvider = provider;
}

export function getMicroserviceClient(
  service: MicroserviceName
): AxiosInstance {
  if (!clients.has(service)) {
    const client = axios.create({
      baseURL: MICROSERVICES_CONFIG[service],
      timeout: 15000,
    });

    client.interceptors.request.use(async (config) => {
      // Primero intenta obtener token del localStorage (puede estar cacheado)
      let token = localStorage.getItem("access_token");

      // Si no hay token pero hay un tokenProvider, obtén uno nuevo
      if (!token && tokenProvider) {
        console.log("[HttpClient] No token in localStorage, fetching...");
        token = (await tokenProvider()) || null;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    clients.set(service, client);
  }

  return clients.get(service)!;
}
