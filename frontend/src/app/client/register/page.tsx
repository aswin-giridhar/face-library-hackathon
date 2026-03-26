"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { registerClient } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const industries = [
  "Fashion",
  "Beauty",
  "Technology",
  "Food & Beverage",
  "Health & Wellness",
  "Lifestyle",
  "Travel",
  "Auto",
  "Real Estate",
  "Consumer Electronics",
  "Entertainment",
  "Other",
];

const roles = [
  "CEO / Founder",
  "Creative Director",
  "Creative Producer",
  "Casting Director",
];

const referralSources = [
  "Google",
  "Social media",
  "From a talent",
  "From a brand",
];

export default function ClientRegisterPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    website: "",
    ai_tools_used: "",
    role_title: "",
    referral_source: "",
    industry: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email !== form.confirmEmail) {
      setErrorMsg("Email addresses do not match.");
      return;
    }
    if (!form.industry) {
      setErrorMsg("Please select an industry.");
      return;
    }
    if (!form.role_title) {
      setErrorMsg("Please select your role.");
      return;
    }
    if (!form.referral_source) {
      setErrorMsg("Please select how you heard about us.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg("You must agree to the Terms of Service.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await registerClient({
        user_id: user?.user_id,
        company_name: form.company_name,
        industry: form.industry,
        website: form.website || undefined,
        phone: form.phone,
        role_title: form.role_title,
        referral_source: form.referral_source,
        ai_tools_used: form.ai_tools_used || undefined,
      });
      setUser({
        user_id: res.user_id || res.id,
        email: form.email,
        name: form.company_name,
        role: "client",
        profile_id: res.id,
      });
      setStatus("success");
      setTimeout(() => router.push("/client/dashboard"), 1500);
    } catch {
      setStatus("error");
      setErrorMsg("Registration failed. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#0B0B0F] flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#FAFAF8]" />
          </div>
          <h1 className="font-display text-3xl text-[#0B0B0F] mb-2">Account Created!</h1>
          <p className="font-body text-[#6B6B73] mb-6">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#E0E0DA] bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0B0B0F]">
              <span className="font-display text-sm font-bold italic text-[#0B0B0F]">FL</span>
            </div>
            <span className="font-body text-sm font-bold tracking-[0.15em] text-[#0B0B0F]">FACE LIBRARY</span>
          </Link>
          <Link href="/login" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-start justify-center px-6 pb-16">
        <div className="w-full max-w-[520px]">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-light text-[#0B0B0F] mb-3">
              Join Face Library
            </h1>
            <p className="font-body text-[15px] text-[#6B6B73]">
              Create your client account to license digital talent
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={(e) => update("company_name", e.target.value)}
                placeholder="Company Name"
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
              />
            </div>

            {/* Company Email + Confirm Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Company Email"
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
              />
              <input
                type="email"
                required
                value={form.confirmEmail}
                onChange={(e) => update("confirmEmail", e.target.value)}
                placeholder="Confirm Email"
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
              />
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Phone"
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
              />
              <input
                type="url"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="Website (optional)"
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
              />
            </div>

            {/* AI Tools Used (optional) */}
            <div>
              <textarea
                value={form.ai_tools_used}
                onChange={(e) => update("ai_tools_used", e.target.value)}
                placeholder="AI Tools Used (optional) — e.g. Midjourney, DALL-E, Runway..."
                rows={3}
                className="w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors resize-none"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <p className="font-body text-[13px] text-[#6B6B73] mb-1">Your Role</p>
              <select
                value={form.role_title}
                onChange={(e) => update("role_title", e.target.value)}
                required
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#0B0B0F] transition-all appearance-none"
              >
                <option value="" disabled>Select your role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Referral Source Dropdown */}
            <div>
              <p className="font-body text-[13px] text-[#6B6B73] mb-1">How did you hear about us?</p>
              <select
                value={form.referral_source}
                onChange={(e) => update("referral_source", e.target.value)}
                required
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#0B0B0F] transition-all appearance-none"
              >
                <option value="" disabled>Select referral source...</option>
                {referralSources.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>

            {/* Industry Selection Grid */}
            <div className="pt-2">
              <p className="font-body text-[13px] text-[#6B6B73] mb-1">Industry</p>
              <p className="font-body text-[12px] text-[#9B9BA3] mb-3">Select your industry from the categories below</p>
              <div className="grid grid-cols-2 gap-2.5">
                {industries.map((ind) => (
                  <label
                    key={ind}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                      form.industry === ind
                        ? "border-[#1E3A5F] bg-[#1E3A5F]/5"
                        : "border-[#E0E0DA] bg-white hover:border-[#C0C0BA]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        form.industry === ind ? "border-[#0B0B0F]" : "border-[#C0C0BA]"
                      }`}
                    >
                      {form.industry === ind && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0B0B0F]" />
                      )}
                    </div>
                    <span className="font-body text-[13px] text-[#0B0B0F]">{ind}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      agreedToTerms
                        ? "border-[#0B0B0F] bg-[#0B0B0F]"
                        : "border-[#C0C0BA] bg-white"
                    }`}
                  >
                    {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="font-body text-[13px] text-[#6B6B73] leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="underline text-[#0B0B0F] underline hover:no-underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline text-[#0B0B0F] underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-semibold py-3.5 px-8 rounded-lg hover:bg-[#1a1a22] transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Creating..." : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <p className="font-body text-sm text-red-500 text-center">{errorMsg}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
