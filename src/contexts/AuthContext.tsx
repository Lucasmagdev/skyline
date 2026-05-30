/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skyline-drive-hub:session:v1";

export type DemoRole = "concierge" | "inspector" | "customer";

export interface DemoUser {
  name: string;
  role: DemoRole;
}

interface AuthContextValue {
  user: DemoUser | undefined;
  signIn: (role: DemoRole) => void;
  signOut: () => void;
  canAccessAdmin: boolean;
  canAccessMaintenance: boolean;
  canAccessUser: boolean;
}

const roleProfiles: Record<DemoRole, DemoUser> = {
  concierge: { name: "Concierge Lead", role: "concierge" },
  inspector: { name: "Fleet Inspector", role: "inspector" },
  customer: { name: "Customer", role: "customer" },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser>();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const stored = JSON.parse(raw) as DemoUser;
      if (stored.role === "concierge" || stored.role === "inspector" || stored.role === "customer") {
        setUser(roleProfiles[stored.role]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn(role) {
        const nextUser = roleProfiles[role];
        setUser(nextUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      },
      signOut() {
        setUser(undefined);
        window.localStorage.removeItem(STORAGE_KEY);
      },
      canAccessAdmin: user?.role === "concierge",
      canAccessMaintenance: user?.role === "concierge" || user?.role === "inspector",
      canAccessUser: user?.role === "customer",
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
