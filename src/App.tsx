import { LoginButton } from "./features/auth/components/LoginButton";
import { LogoutButton } from "./features/auth/components/LogoutButton";
import { BackendStatus } from "./shared/components/BackendStatus";

function App() {
  return (
    <div className="App">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <LoginButton />
          <LogoutButton />
        </div>
        <BackendStatus />
      </div>
    </div>
  );
}

export default App;
