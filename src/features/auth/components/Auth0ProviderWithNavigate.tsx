import { Auth0Provider } from "@auth0/auth0-react";
import type { AppState } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import { auth0Config } from "../../../config/auth0";

interface Props {
  children: ReactNode;
}

export function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    // Redirigir al usuario a donde intentaba ir originalmente o a /chat por defecto
    navigate((appState as { returnTo?: string })?.returnTo || "/chat", {
      replace: true,
    });
  };

  return (
    <Auth0Provider {...auth0Config} onRedirectCallback={onRedirectCallback}>
      {children}
    </Auth0Provider>
  );
}
