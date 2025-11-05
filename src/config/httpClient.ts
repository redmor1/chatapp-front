import axios from "axios";
import type { AxiosInstance } from "axios";
import type { MicroserviceName } from "./microservices";
import { MICROSERVICES_CONFIG } from "./microservices";

const clients = new Map<MicroserviceName, AxiosInstance>();

export function getMicroserviceClient(
  service: MicroserviceName
): AxiosInstance {
  if (!clients.has(service)) {
    const client = axios.create({
      baseURL: MICROSERVICES_CONFIG[service],
      timeout: 10000,
    });

    client.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    clients.set(service, client);
  }

  return clients.get(service)!;
}
