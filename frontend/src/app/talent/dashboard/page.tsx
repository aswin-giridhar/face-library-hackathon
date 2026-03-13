/**
 * Talent Dashboard — Manage likeness licensing preferences and incoming requests.
 *
 * Layout (wireframe):
 * - Top: DashboardNav
 * - Row 1: My Face Profile (left) | License Passports (center) | Active Licenses / Revenue (right)
 * - Row 2: Licensing Preferences grid (15 categories with allowed/blocked toggles)
 * - Row 3: Incoming License Requests list with approve/reject buttons
 *
 * Accessible at: /talent/dashboard (requires talent role)
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, MapPin, Shield, CheckCircle, XCircle, DollarSign, FileText } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/lib/auth";
import {
  getTalent,
  listTalents,
  updateTalentPreferences,
  getTalentRequests,
  approveLicense,
  getWatermarkByTalent,
} from "@/lib/api";

/* ---------- Types ---------- */

interface TalentProfileData {
  id: number;
  user_id: number;
  name: string;
  email: string;
  bio: string | null;
  photo_url: string | null;
  categories: string | null;
  restricted_categories: string | null;
  approval_mode: string;
  geo_scope: string;
  min_price_per_use: number;
  [key: string]: unknown;
}

interface LicenseRequestData {
  id: number;
  status: string;
  brand_name: string;
  use_case: string;
  content_type: string;
  license_type: string | null;
  desired_duration_days: number;
  desired_regions: string | null;
  proposed_price: number | null;
  risk_score: string | null;
  created_at: string;
}

interface WatermarkEntry {
  id: number;
  license_id: number;
  [key: string]: unknown;
}

/* ---------- Constants ---------- */

const AD_CATEGORIES = [
  "Fashion",
  "Beauty",
  "Technology",
  "Automotive",
  "Food & Beverage",
  "Healthcare",
  "Finance",
  "Entertainment",
  "Sports",
  "Travel",
  "Real Estate",
  "Education",
  "Gaming",
  "Alcohol",
  "Gambling",
];

/* ---------- Component ---------- */

export default function TalentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<TalentProfileData | null>(null);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [approvalMode, setApprovalMode] = useState("manual");
  const [geoScope, setGeoScope] = useState("global");
  const [requests, setRequests] = useState<LicenseRequestData[]>([]);
  const [watermarks, setWatermarks] = useState<WatermarkEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* --- Bootstrap data --- */

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "talent")) {
      router.push("/login");
      return;
    }
    if (user) {
      findAndLoadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  /**
   * Find talent profile by iterating through talents and matching user_id,
   * then load associated data.
   */
  const findAndLoadProfile = async () => {
    try {
      // If we already have a direct profile_id, use it
      if (user?.profile_id) {
        await loadData(user.profile_id);
        return;
      }

      // Otherwise iterate talents to find by user_id
      const talents: TalentProfileData[] = await listTalents();
      const match = talents.find((t) => t.user_id === user?.user_id);
      if (match) {
        await loadData(match.id);
      }
    } catch {
      // Profile may not exist yet
    }
  };

  const loadData = async (profileId: number) => {
    try {
      const [p, r] = await Promise.all([
        getTalent(profileId),
        getTalentRequests(profileId),
      ]);
      setProfile(p);
      setAllowed((p.categories || "").split(",").filter(Boolean));
      setBlocked((p.restricted_categories || "").split(",").filter(Boolean));
      setApprovalMode(p.approval_mode || "manual");
      setGeoScope(p.geo_scope || "global");
      setRequests(r);

      // Load watermark tracking data
      try {
        const w = await getWatermarkByTalent(profileId);
        setWatermarks(Array.isArray(w) ? w : []);
      } catch {
        setWatermarks([]);
      }
    } catch {
      // Profile may not exist yet
    }
  };

  /* --- Category toggle (allowed <-> blocked) --- */

  const toggleCategory = (cat: string) => {
    if (allowed.includes(cat)) {
      setAllowed(allowed.filter((c) => c !== cat));
      setBlocked([...blocked, cat]);
    } else if (blocked.includes(cat)) {
      setBlocked(blocked.filter((c) => c !== cat));
    } else {
      setAllowed([...allowed, cat]);
    }
  };

  /* --- Save preferences --- */

  const handleSave = async () => {
    const profileId = profile?.id ?? user?.profile_id;
    if (!profileId) return;
    setSaving(true);
    try {
      await updateTalentPreferences(profileId, {
        categories: allowed.join(","),
        restricted_categories: blocked.join(","),
        approval_mode: approvalMode,
        geo_scope: geoScope,
      });
      setMessage("Preferences saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Failed to save preferences.");
    }
    setSaving(false);
  };

  /* --- Approve / Reject --- */

  const handleRequestAction = async (id: number, approved: boolean) => {
    try {
      await approveLicense(id, approved);
      const profileId = profile?.id ?? user?.profile_id;
      if (profileId) loadData(profileId);
    } catch {
      setMessage("Action failed. Please try again.");
    }
  };

  /* --- Derived stats --- */

  const activeLicenses = requests.filter(
    (r) => r.status === "active" || r.status === "approved"
  );
  const totalRevenue = activeLicenses.reduce(
    (sum, r) => sum + (r.proposed_price ?? 0),
    0
  );
  const pendingRequests = requests.filter(
    (r) => r.status === "pending" || r.status === "awaiting_approval"
  );

  /* --- Loading state --- */

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0B0B0F] border-t-transparent" />
      </div>
    );
  }

  /* --- Render --- */

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-[#0B0B0F]">
            Talent Dashboard
          </h1>
          <p className="font-body text-sm text-[#6B6B73]">
            Manage your likeness licensing preferences and incoming requests
          </p>
        </div>

        {/* Toast message */}
        {message && (
          <div className="mb-6 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 font-body text-sm">
            {message}
          </div>
        )}

        {/* ===== Row 1: Three-column top cards ===== */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* --- Left: My Face Profile --- */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5">
              My Face Profile
            </h3>

            <div className="flex flex-col items-center mb-5">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E0E0DA]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#F5F5F0] border-2 border-[#E0E0DA] flex items-center justify-center">
                  <User className="w-8 h-8 text-[#6B6B73]" />
                </div>
              )}
            </div>

            <div className="space-y-3 font-body text-sm">
              <div>
                <span className="text-[#6B6B73] block text-xs">Name</span>
                <span className="font-medium text-[#0B0B0F]">
                  {profile?.name || "---"}
                </span>
              </div>
              <div>
                <span className="text-[#6B6B73] block text-xs">Email</span>
                <span className="text-[#0B0B0F]">
                  {profile?.email || user?.email || "---"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#6B6B73]" />
                <span className="text-[#6B6B73] text-xs">Geo Scope:</span>
                <span className="text-[#0B0B0F] capitalize font-medium">
                  {geoScope}
                </span>
              </div>
            </div>
          </div>

          {/* --- Center: License Passports --- */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5 flex items-center gap-2">
              <Shield className="h-4 w-4" /> License Passports
            </h3>

            <div className="space-y-4">
              {/* Auto-approve toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-sm text-[#0B0B0F] block">
                    Auto-Approve
                  </span>
                  <span className="font-body text-xs text-[#6B6B73]">
                    Automatically approve matching requests
                  </span>
                </div>
                <button
                  onClick={() =>
                    setApprovalMode(
                      approvalMode === "auto" ? "manual" : "auto"
                    )
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    approvalMode === "auto" ? "bg-[#0B0B0F]" : "bg-[#E0E0DA]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      approvalMode === "auto" ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Geographic scope selector */}
              <div>
                <span className="font-body text-sm text-[#0B0B0F] block mb-1">
                  Geographic Scope
                </span>
                <select
                  value={geoScope}
                  onChange={(e) => setGeoScope(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E0DA] rounded-md font-body text-sm bg-white text-[#0B0B0F]"
                >
                  <option value="uk">UK Only</option>
                  <option value="eu">EU</option>
                  <option value="global">Global</option>
                </select>
              </div>

              {/* Minimum price */}
              <div>
                <span className="font-body text-sm text-[#0B0B0F] block mb-1">
                  Min Price / Use
                </span>
                <p className="font-body text-lg font-semibold text-[#0B0B0F]">
                  ${profile?.min_price_per_use?.toLocaleString() ?? "0"}
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium py-2.5 rounded-md hover:bg-[#0B0B0F]/80 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>

          {/* --- Right: Active Licenses + Revenue --- */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Active Licenses
            </h3>

            <div className="space-y-5">
              <div className="text-center py-3 rounded-lg bg-[#FAFAF8] border border-[#E0E0DA]">
                <p className="font-display text-3xl font-bold text-[#0B0B0F]">
                  {activeLicenses.length}
                </p>
                <p className="font-body text-xs text-[#6B6B73] mt-1">
                  Active Licenses
                </p>
              </div>

              <div className="text-center py-3 rounded-lg bg-[#FAFAF8] border border-[#E0E0DA]">
                <p className="font-display text-3xl font-bold text-[#0B0B0F] flex items-center justify-center gap-1">
                  <DollarSign className="h-6 w-6" />
                  {totalRevenue.toLocaleString()}
                </p>
                <p className="font-body text-xs text-[#6B6B73] mt-1">
                  Total Revenue
                </p>
              </div>

              <div className="flex items-center justify-between font-body text-sm">
                <span className="text-[#6B6B73]">Pending Requests</span>
                <span className="font-medium text-[#0B0B0F]">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="flex items-center justify-between font-body text-sm">
                <span className="text-[#6B6B73]">Watermarks Tracked</span>
                <span className="font-medium text-[#0B0B0F]">
                  {watermarks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Row 2: Licensing Preferences (15 categories) ===== */}
        <div className="bg-white border border-[#E0E0DA] rounded-lg p-6 mb-8">
          <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-1">
            Licensing Preferences
          </h3>
          <p className="font-body text-xs text-[#6B6B73] mb-5">
            Toggle each ad category to allowed or blocked for incoming campaigns.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AD_CATEGORIES.map((cat) => {
              const isAllowed = allowed.includes(cat);
              const isBlocked = blocked.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-sm font-body transition-colors text-left ${
                    isBlocked
                      ? "border-red-300 bg-red-50"
                      : isAllowed
                      ? "border-green-300 bg-green-50"
                      : "border-[#E0E0DA] bg-white hover:bg-[#FAFAF8]"
                  }`}
                >
                  <span
                    className={
                      isBlocked
                        ? "line-through text-[#6B6B73]"
                        : "text-[#0B0B0F]"
                    }
                  >
                    {cat}
                  </span>
                  <span
                    className={`ml-2 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      isBlocked
                        ? "bg-red-100 text-red-700"
                        : isAllowed
                        ? "bg-green-100 text-green-700"
                        : "bg-[#F5F5F0] text-[#6B6B73]"
                    }`}
                  >
                    {isBlocked ? "Blocked" : isAllowed ? "Allowed" : "Off"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium py-2 px-6 rounded-md hover:bg-[#0B0B0F]/80 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>
            <span className="font-body text-xs text-[#6B6B73]">
              Click a category to cycle: allowed &rarr; blocked &rarr; off
            </span>
          </div>
        </div>

        {/* ===== Row 3: Incoming License Requests ===== */}
        <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
          <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5">
            Incoming License Requests
          </h3>

          {requests.length === 0 ? (
            <p className="font-body text-sm text-[#6B6B73]">
              No incoming requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-[#E0E0DA] p-4 gap-4"
                >
                  {/* Request details */}
                  <div className="space-y-1 flex-1">
                    <p className="font-body text-sm font-medium text-[#0B0B0F]">
                      {r.brand_name}
                    </p>
                    <p className="font-body text-xs text-[#6B6B73]">
                      {r.use_case}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#6B6B73] capitalize">
                        {(r.license_type || r.content_type || "standard").replace(
                          /_/g,
                          " "
                        )}
                      </span>
                      <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#6B6B73]">
                        {r.desired_duration_days} days
                      </span>
                      {r.desired_regions && (
                        <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#6B6B73]">
                          {r.desired_regions}
                        </span>
                      )}
                      {r.proposed_price != null && (
                        <span className="font-body text-xs font-medium text-[#0B0B0F]">
                          ${r.proposed_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`font-body text-xs px-3 py-1 rounded-full capitalize ${
                        r.status === "active" || r.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : r.status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : r.status === "awaiting_approval" ||
                            r.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-[#F5F5F0] text-[#6B6B73]"
                      }`}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>

                    {(r.status === "awaiting_approval" ||
                      r.status === "pending") && (
                      <>
                        <button
                          onClick={() => handleRequestAction(r.id, true)}
                          className="flex items-center gap-1 font-body text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleRequestAction(r.id, false)}
                          className="flex items-center gap-1 font-body text-xs font-medium bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}

                    <Link
                      href={`/license/${r.id}`}
                      className="font-body text-xs text-[#0B0B0F] hover:underline ml-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
