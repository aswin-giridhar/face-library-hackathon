"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrandRegisterRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/client/register"); }, [router]);
  return <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
    <p className="font-body text-[#6B6B73]">Redirecting...</p>
  </div>;
}
