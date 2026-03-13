"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Send, FileText, CreditCard } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/lib/auth";
import {
  listTalents,
  createLicenseRequest,
  getClientRequests,
  generateContract,
  createCheckoutSession,
} from "@/lib/api";

interface TalentListItem {
  id: number;
  name: string;
  bio: string | null;
  categories: string | null;
  min_price_per_use: number;
  geo_scope: string;
  approval_mode: string;
}

interface ClientRequestItem {
  id: number;
  status: string;
  talent_name: string;
  talent_id: number;
  use_case: string;
  content_type: string;
  desired_duration_days: number;
  desired_regions: string | null;
  proposed_price: number | null;
  has_contract: boolean;
  payment_status: string | null;
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  under_review: "bg-blue-50 text-blue-700",
  awaiting_approval: "bg-orange-50 text-orange-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  active: "bg-emerald-50 text-emerald-700",
};

export default function ClientDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [talents, setTalents] = useState<TalentListItem[]>([]);
  const [requests, setRequests] = useState<ClientRequestItem[]>([]);

  // Form state
  const [talentId, setTalentId] = useState("");
  const [licenseType, setLicenseType] = useState("standard");
  const [useCase, setUseCase] = useState("");
  const [contentType, setContentType] = useState("image");
  const [duration, setDuration] = useState("30");
  const [regions, setRegions] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "client")) {
      router.push("/login");
      return;
    }
    if (user?.profile_id) loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      const [t, r] = await Promise.all([
        listTalents(),
        user?.profile_id ? getClientRequests(user.profile_id) : Promise.resolve([]),
      ]);
      setTalents(t);
      setRequests(r);
    } catch {
      // silent
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.profile_id || !talentId || !useCase) return;
    setSubmitting(true);
    setMessage("");
    try {
      await createLicenseRequest({
        brand_id: user.profile_id,
        talent_id: parseInt(talentId),
        license_type: licenseType,
        use_case: useCase,
        content_type: contentType,
        desired_duration_days: parseInt(duration),
        desired_regions: regions || undefined,
        proposed_price: proposedPrice ? parseFloat(proposedPrice) : undefined,
      });
      setMessage("License request created successfully.");
      setTalentId("");
      setLicenseType("standard");
      setUseCase("");
      setContentType("image");
      setDuration("30");
      setRegions("");
      setProposedPrice("");
      loadData();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to create request");
    }
    setSubmitting(false);
  };

  const handleGenerateContract = async (licenseId: number) => {
    setGeneratingId(licenseId);
    try {
      await generateContract(licenseId);
      setMessage("Contract generated successfully.");
      loadData();
    } catch {
      setMessage("Failed to generate contract.");
    }
    setGeneratingId(null);
  };

  const handlePay = async (licenseId: number) => {
    setPayingId(licenseId);
    try {
      const result = await createCheckoutSession(licenseId);
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment failed");
    }
    setPayingId(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E3A5F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-8 lg:px-16 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-[#0B0B0F]">Client Dashboard</h1>
          <p className="font-body text-sm text-[#6B6B73]">Create and manage your license requests</p>
        </div>

        {message && (
          <div className="mb-6 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-body text-sm">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Create License Request */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-body text-sm font-medium text-[#0B0B0F] mb-4">Create License Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Talent Selector */}
              <div>
                <label className="block font-body text-sm text-[#0B0B0F] mb-1">Select Talent *</label>
                <select
                  value={talentId}
                  onChange={(e) => setTalentId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white"
                >
                  <option value="">Choose talent...</option>
                  {talents.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* License Type Radio Group */}
              <div>
                <label className="block font-body text-sm text-[#0B0B0F] mb-2">License Type *</label>
                <div className="flex gap-3">
                  {[
                    { value: "standard", label: "Standard" },
                    { value: "exclusive", label: "Exclusive" },
                    { value: "time_limited", label: "Time-Limited" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all font-body text-sm ${
                        licenseType === opt.value
                          ? "border-[#4F6AF6] bg-[#4F6AF6]/5 text-[#0B0B0F]"
                          : "border-[#E0E0DA] text-[#6B6B73] hover:border-[#C0C0BA]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          licenseType === opt.value ? "border-[#4F6AF6]" : "border-[#C8C8D0]"
                        }`}
                      >
                        {licenseType === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-[#4F6AF6]" />
                        )}
                      </div>
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Use Case */}
              <div>
                <label className="block font-body text-sm text-[#0B0B0F] mb-1">Use Case / Campaign *</label>
                <textarea
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white resize-none"
                  placeholder="Describe how you plan to use the talent's likeness..."
                />
              </div>

              {/* Content Type & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-sm text-[#0B0B0F] mb-1">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-sm text-[#0B0B0F] mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                  </select>
                </div>
              </div>

              {/* Regions */}
              <div>
                <label className="block font-body text-sm text-[#0B0B0F] mb-1">Regions</label>
                <input
                  type="text"
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white"
                  placeholder="e.g. US, EU, Global (leave blank for global)"
                />
              </div>

              {/* Proposed Price */}
              <div>
                <label className="block font-body text-sm text-[#0B0B0F] mb-1">Proposed Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white"
                  placeholder="Enter your proposed price"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium py-2.5 rounded-md hover:bg-[#1E3A5F] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

          {/* Your Requests */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-body text-sm font-medium text-[#0B0B0F] mb-4">Your Requests</h3>
            {requests.length === 0 ? (
              <p className="font-body text-sm text-[#6B6B73]">No requests submitted yet.</p>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto">
                {requests.map((r) => (
                  <div key={r.id} className="rounded-lg border border-[#E0E0DA] p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm font-medium text-[#0B0B0F]">{r.talent_name}</p>
                      <span
                        className={`font-body text-xs px-3 py-1 rounded-full capitalize ${
                          STATUS_BADGE[r.status] || "bg-[#F5F5F0] text-[#6B6B73]"
                        }`}
                      >
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="font-body text-xs text-[#6B6B73] mt-1">{r.use_case}</p>
                    <p className="font-body text-xs text-[#6B6B73]">
                      {r.content_type} &middot; {r.desired_duration_days} days
                    </p>
                    {r.proposed_price != null && (
                      <p className="font-body text-xs text-[#6B6B73] mt-1">
                        Price: ${r.proposed_price.toLocaleString()}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {/* Generate Contract */}
                      <button
                        onClick={() => handleGenerateContract(r.id)}
                        disabled={generatingId === r.id}
                        className="flex items-center gap-1 font-body text-xs bg-[#0B0B0F] text-[#FAFAF8] px-3 py-1.5 rounded-md hover:bg-[#1E3A5F] transition-colors disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {generatingId === r.id ? "Generating..." : "Generate Contract"}
                      </button>

                      {/* Pay */}
                      {(r.status === "approved" || r.status === "active") && r.payment_status !== "paid" && (
                        <button
                          onClick={() => handlePay(r.id)}
                          disabled={payingId === r.id}
                          className="flex items-center gap-1 font-body text-xs bg-[#1E3A5F] text-white px-3 py-1.5 rounded-md hover:bg-[#0B0B0F] transition-colors disabled:opacity-50"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {payingId === r.id ? "Redirecting..." : "Pay"}
                        </button>
                      )}

                      {r.payment_status === "paid" && (
                        <span className="font-body text-xs text-emerald-600 px-2 py-1">Paid</span>
                      )}

                      <Link
                        href={`/license/${r.id}`}
                        className="font-body text-xs text-[#1E3A5F] hover:underline ml-auto"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
