"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const dashboardPath = user?.role === "talent"
    ? "/talent/dashboard"
    : user?.role === "client"
    ? "/client/dashboard"
    : user?.role === "agent"
    ? "/agent/dashboard"
    : "/";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 lg:px-16 h-16 border-b border-[#E0E0DA] bg-white">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0B0B0F]">
          <span className="font-display text-sm font-bold italic text-[#0B0B0F]">FL</span>
        </div>
        <span className="font-body text-sm font-bold tracking-[0.2em] text-[#0B0B0F]">FACE LIBRARY</span>
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link href={dashboardPath} className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
              Dashboard
            </Link>
            <Link href="/talent/library" className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
              Library
            </Link>
            <span className="font-body text-xs text-[#6B6B73]">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </>
        )}
        {!user && (
          <>
            <Link href="/login" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="font-body text-sm font-medium text-[#FAFAF8] bg-[#0B0B0F] px-5 py-2 rounded-full hover:bg-[#0B0B0F]/90 transition-colors">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
