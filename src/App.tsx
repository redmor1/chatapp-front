import { LoginButton } from "./features/auth/components/LoginButton";
import { BackendStatus } from "./shared/components/BackendStatus";

function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {" "}
        <BackendStatus />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ChatApp</h1>
          <p className="text-gray-600">Mensajería en tiempo real</p>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Inicia sesión para comenzar a chatear
            </p>
            <LoginButton />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>🔒 Autenticación segura con Auth0</p>
              <p>💬 Chats grupales y directos</p>
              <p>⚡ Mensajería en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
