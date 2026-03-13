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
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F6AF6] to-[#6C8AFF] flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
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
      <header className="flex items-center justify-center py-8">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0B0B0F]">
              <span className="font-display text-sm font-bold italic text-[#0B0B0F]">FL</span>
            </div>
            <span className="font-body text-sm font-bold tracking-[0.2em] text-[#0B0B0F]">FACE LIBRARY</span>
          </div>
          <span className="font-body text-[10px] font-light tracking-[0.2em] text-[#9B9BA3]">
            Secure Likeness Licensing Platform
          </span>
        </Link>
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
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] placeholder-[#B0B0B8] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all"
              />
            </div>

            {/* Company Email */}
            <div>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Company Email"
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] placeholder-[#B0B0B8] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Phone"
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] placeholder-[#B0B0B8] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all"
              />
            </div>

            {/* Website (optional) */}
            <div>
              <input
                type="url"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="Website (optional)"
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] placeholder-[#B0B0B8] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all"
              />
            </div>

            {/* AI Tools Used (optional) */}
            <div>
              <textarea
                value={form.ai_tools_used}
                onChange={(e) => update("ai_tools_used", e.target.value)}
                placeholder="AI Tools Used (optional) — e.g. Midjourney, DALL-E, Runway..."
                rows={3}
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] placeholder-[#B0B0B8] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all resize-none"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <p className="font-body text-[13px] text-[#6B6B73] mb-1">Your Role</p>
              <select
                value={form.role_title}
                onChange={(e) => update("role_title", e.target.value)}
                required
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all appearance-none"
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
                className="w-full bg-[#F8F8FA] border border-[#E8E8EC] rounded-xl px-5 py-3.5 font-body text-[15px] text-[#0B0B0F] focus:outline-none focus:ring-2 focus:ring-[#4F6AF6]/30 focus:border-[#4F6AF6] transition-all appearance-none"
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
                        ? "border-[#4F6AF6] bg-[#4F6AF6]/5"
                        : "border-[#E8E8EC] bg-[#F8F8FA] hover:border-[#D0D0D8]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        form.industry === ind ? "border-[#4F6AF6]" : "border-[#C8C8D0]"
                      }`}
                    >
                      {form.industry === ind && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#4F6AF6]" />
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
                        ? "border-[#4F6AF6] bg-[#4F6AF6]"
                        : "border-[#C8C8D0] bg-white"
                    }`}
                  >
                    {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="font-body text-[13px] text-[#6B6B73] leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="underline text-[#4F6AF6] hover:text-[#3B56E0]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline text-[#4F6AF6] hover:text-[#3B56E0]">
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F6AF6] to-[#6C8AFF] text-white font-body text-[15px] font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-[#4F6AF6]/25 transition-all duration-300 disabled:opacity-50"
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
