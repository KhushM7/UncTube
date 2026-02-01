"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ProfileContextType {
  profileId: string;
  setProfileId: (id: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<string>("");
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedId = window.localStorage.getItem("heirloom_profile_id") || "";
    const storedName = window.localStorage.getItem("heirloom_profile_name") || "";
    if (storedId) setProfileId(storedId);
    if (storedName) setProfileName(storedName);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (profileId) {
      window.localStorage.setItem("heirloom_profile_id", profileId);
    } else {
      window.localStorage.removeItem("heirloom_profile_id");
    }
  }, [profileId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (profileName) {
      window.localStorage.setItem("heirloom_profile_name", profileName);
    } else {
      window.localStorage.removeItem("heirloom_profile_name");
    }
  }, [profileName]);

  return (
    <ProfileContext.Provider
      value={{ profileId, setProfileId, profileName, setProfileName }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
