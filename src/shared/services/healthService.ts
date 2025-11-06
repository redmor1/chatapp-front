import { getMicroserviceClient } from "../../config/httpClient";
import type { MicroserviceName } from "../../config/microservices";

export interface ServiceHealth {
  name: MicroserviceName;
  isHealthy: boolean;
  timestamp: Date;
}

export interface HealthStatus {
  services: ServiceHealth[];
  timestamp: Date;
}

class HealthService {
  private cache: HealthStatus | null = null;
  private cacheTimeout = 30000; // 30 segundos
  private lastFetch = 0;

  async checkHealth(): Promise<HealthStatus> {
    const now = Date.now();

    // Usar cache si está fresco
    if (this.cache && now - this.lastFetch < this.cacheTimeout) {
      return this.cache;
    }

    const services: ServiceHealth[] = [];
    const serviceNames: MicroserviceName[] = [
      "users",
      "messages",
      "conversations",
    ];

    // Verificar los 3 microservicios en paralelo
    await Promise.all(
      serviceNames.map(async (service) => {
        try {
          const client = getMicroserviceClient(service);
          await client.get("/api/v1/health", {
            timeout: 5000,
          });

          services.push({
            name: service,
            isHealthy: true,
            timestamp: new Date(),
          });
        } catch {
          services.push({
            name: service,
            isHealthy: false,
            timestamp: new Date(),
          });
        }
      })
    );

    const status: HealthStatus = {
      services,
      timestamp: new Date(),
    };

    this.cache = status;
    this.lastFetch = now;
    return status;
  }

  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

export const healthService = new HealthService();
