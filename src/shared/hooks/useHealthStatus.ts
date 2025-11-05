import { useState, useEffect } from "react";
import { healthService, type HealthStatus } from "../services/healthService";

export function useHealthStatus() {
  const [status, setStatus] = useState<HealthStatus>({
    services: [
      { name: "users", isHealthy: true, timestamp: new Date() },
      { name: "messages", isHealthy: true, timestamp: new Date() },
      { name: "groups", isHealthy: true, timestamp: new Date() },
    ],
    timestamp: new Date(),
  });

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true);
      const result = await healthService.checkHealth();
      setStatus(result);
      setIsChecking(false);
    };

    // Verificar inmediatamente
    checkHealth();

    // Verificar cada 60 segundos
    const interval = setInterval(checkHealth, 60000);

    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    healthService.clearCache();
    setIsChecking(true);
    const result = await healthService.checkHealth();
    setStatus(result);
    setIsChecking(false);
  };

  return {
    services: status.services,
    isChecking,
    refresh,
  };
}
