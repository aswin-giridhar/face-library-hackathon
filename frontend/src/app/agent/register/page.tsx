"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { signup, registerAgent } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const industries = [
  "Fashion",
  "Beauty",
  "Technology",
  "Sports",
  "Entertainment",
  "Music",
  "Lifestyle",
  "Other",
];

export default function AgentRegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    agencyName: "",
    portfolioUrl: "",
    instagram: "",
    industry: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full bg-white border border-[#E0E0DA] rounded-lg px-4 py-3 font-body text-sm text-[#0B0B0F] placeholder-[#9B9BA3] focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.email !== form.confirmEmail) {
      setErrorMsg("Email addresses do not match.");
      return;
    }
    if (!form.industry) {
      setErrorMsg("Please select an industry.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg("You must agree to the Privacy Policy and Terms & Conditions.");
      return;
    }

    setStatus("loading");
    try {
      const fullName = `${form.firstName} ${form.lastName}`;
      const res = await signup({
        email: form.email,
        password: form.password,
        name: fullName,
        role: "agent",
        company: form.agencyName,
      });

      setUser({
        user_id: res.user_id || res.id,
        email: form.email,
        name: fullName,
        role: "agent",
        profile_id: res.profile_id || null,
      });

      await registerAgent({
        user_id: res.id,
        agency_name: form.agencyName,
        portfolio_url: form.portfolioUrl || undefined,
        instagram: form.instagram || undefined,
        industry: form.industry,
      });

      setStatus("success");
      setTimeout(() => router.push("/agent/dashboard"), 1500);
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
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl text-[#0B0B0F] mb-2">Agency Account Created!</h1>
          <p className="font-body text-[#6B6B73] mb-6">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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

      <main className="flex-1 flex items-start justify-center px-6 pb-16">
        <div className="w-full max-w-[520px]">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-light text-[#0B0B0F] mb-3">
              Agency Registration
            </h1>
            <p className="font-body text-[15px] text-[#6B6B73] leading-relaxed max-w-md mx-auto">
              Sign up as an agency partner and manage talent, campaigns, and digital likeness licensing through our platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information */}
            <div>
              <p className="font-body text-[13px] font-semibold text-[#0B0B0F] mb-3 uppercase tracking-wider">
                Account Information
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="First Name"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Last Name"
                    className={inputClass}
                  />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Email Address"
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  value={form.confirmEmail}
                  onChange={(e) => update("confirmEmail", e.target.value)}
                  placeholder="Confirm Email Address"
                  className={inputClass}
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Password"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Agency Details */}
            <div>
              <p className="font-body text-[13px] font-semibold text-[#0B0B0F] mb-3 uppercase tracking-wider">
                Agency Details
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  value={form.agencyName}
                  onChange={(e) => update("agencyName", e.target.value)}
                  placeholder="Agency Name"
                  className={inputClass}
                />
                <input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => update("portfolioUrl", e.target.value)}
                  placeholder="Portfolio URL (optional)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  placeholder="Instagram (optional)"
                  className={inputClass}
                />
                <select
                  required
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className={`${inputClass} appearance-none`}
                  style={{ color: form.industry ? "#0B0B0F" : "#B0B0B8" }}
                >
                  <option value="" disabled>
                    Industry
                  </option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="pt-0.5">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    agreedToTerms
                      ? "border-[#0B0B0F] bg-[#0B0B0F]"
                      : "border-[#C0C0BA] bg-white"
                  }`}
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="font-body text-[13px] text-[#6B6B73] leading-relaxed">
                I agree to the{" "}
                <Link href="/privacy" className="underline text-[#0B0B0F] hover:no-underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline text-[#0B0B0F] hover:no-underline">
                  Terms &amp; Conditions
                </Link>
              </span>
            </label>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-semibold py-3.5 px-8 rounded-lg hover:bg-[#1a1a22] transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Creating..." : "Create Agency Account"}
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
