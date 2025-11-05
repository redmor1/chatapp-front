import { useHealthStatus } from "../hooks/useHealthStatus";

export function BackendStatus() {
  const { services, isChecking, refresh } = useHealthStatus();

  return (
    <div className="flex items-center gap-3">
      {services.map((service) => (
        <div
          key={service.name}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 border border-gray-200"
          title={`${service.name}: ${
            service.isHealthy ? "disponible" : "no disponible"
          }`}
        >
          {/* Indicador visual */}
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              isChecking
                ? "bg-yellow-500 animate-pulse"
                : service.isHealthy
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          {/* Texto */}
          <span
            className={`text-xs font-medium transition-colors capitalize ${
              isChecking
                ? "text-yellow-700"
                : service.isHealthy
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {isChecking ? "Verificando..." : service.name}
          </span>
        </div>
      ))}

      {/* Botón de refresh */}
      <button
        onClick={refresh}
        disabled={isChecking}
        className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Verificar estado de todos los servicios"
      >
        <svg
          className={`w-4 h-4 transition-transform ${
            isChecking ? "animate-spin" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
}
