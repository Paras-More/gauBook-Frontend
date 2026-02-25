import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum UserRoleEnum {
  Volunteer = "volunteer",
  Donor = "donor",
  Influencer = "influencer",
  Gaushala = "gaushala",
  NGO = "ngo",
  Vendor = "vendor",
  User = "user",
}

interface AuthState {
  userId: string | null;
  userName: string | null;
  role: UserRoleEnum | null;
  setUser: (id: string, name: string, role: UserRoleEnum) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      userName: null,
      role: null,
      setUser: (id, name, role) => set({ userId: id, userName: name, role }),
      clearUser: () => set({ userId: null, userName: null, role: null }),
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
);
