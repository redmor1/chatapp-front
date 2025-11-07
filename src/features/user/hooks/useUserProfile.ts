import { useState, useEffect, useCallback } from "react";
import { getMyProfile, updateMyProfile } from "../api/userApi";
import type { UserProfile, UpdateProfileData } from "../types/userTypes";
import { useAuth } from "../../auth/hooks/useAuth";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

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
  }, [isAuthenticated]);

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

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: loadProfile,
  };
}
