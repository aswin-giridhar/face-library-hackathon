"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

interface AuthUser {
  user_id: number;
  email: string;
  name: string;
  role: string;
  profile_id: number | null;
  access_token?: string | null;
  auth_provider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore from localStorage
    const stored = localStorage.getItem("fl_user");
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        localStorage.removeItem("fl_user");
      }
    }
    setIsLoading(false);

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          setUserState(null);
          localStorage.removeItem("fl_user");
        }
        // SIGNED_IN and TOKEN_REFRESHED are handled by login/signup flows
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("fl_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("fl_user");
    }
  };

  const logout = async () => {
    // Sign out from Supabase
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore errors -- still clear local state
    }
    setUserState(null);
    localStorage.removeItem("fl_user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
