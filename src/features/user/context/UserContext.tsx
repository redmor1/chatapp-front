import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { getMyProfile, updateMyProfile } from "../api/userApi";
import type { UserProfile, UpdateProfileData } from "../types/userTypes";

interface UserContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: UpdateProfileData) => Promise<UserProfile>;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error("Error loading user profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: UpdateProfileData) => {
    setError(null);
    try {
      const updatedProfile = await updateMyProfile(updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError("Error al actualizar el perfil");
      console.error("Error updating profile:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <UserContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        refetch: loadProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
