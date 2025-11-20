// src/hooks/useProfile.js
import { useContext } from "react";
import { ProfileContext } from "@/contexts/ProfileContext";

export function useProfile() {
  return useContext(ProfileContext);
}
