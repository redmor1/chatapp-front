export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | undefined>;
}
