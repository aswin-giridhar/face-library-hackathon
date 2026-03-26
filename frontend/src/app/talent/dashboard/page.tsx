/**
 * Talent Dashboard — Manage digital likeness and incoming approvals.
 *
 * Layout (wireframe):
 * - Top: Inline nav bar with FACE LIBRARY logo + tabs (Dashboard, My Face, Licenses, Usage, Settings) + user name
 * - Header: "Talent Dashboard" + subtitle
 * - Row 1: My Face Profile (left) | License Passports (center) | Active Licenses / Revenue (right)
 * - Row 2: Incoming License Requests table with approve/reject buttons
 *
 * Accessible at: /talent/dashboard (requires talent role)
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  CheckCircle,
  XCircle,
  Instagram,
  Shield,
  Upload,
  Edit3,
  ExternalLink,
} from "lucide-react";
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
  "Travel",
  "Auto",
  "Finance",
  "Health",
  "Other",
];

const NAV_TABS = ["Dashboard", "My Face", "Licenses", "Usage", "Settings"];

/* ---------- Component ---------- */

export default function TalentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<TalentProfileData | null>(null);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [approvalMode, setApprovalMode] = useState("manual");
  const [geoScope, setGeoScope] = useState("global");
  const [aiRights, setAiRights] = useState("clothing_only");
  const [exclusivity, setExclusivity] = useState("exclusive");
  const [requests, setRequests] = useState<LicenseRequestData[]>([]);
  const [watermarks, setWatermarks] = useState<WatermarkEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  const findAndLoadProfile = async () => {
    try {
      if (user?.profile_id) {
        await loadData(user.profile_id);
        return;
      }
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

  /* --- Toggle helper --- */

  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
        enabled ? "bg-[#0B0B0F]" : "bg-[#E0E0DA]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
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
      {/* ===== Top Nav Bar ===== */}
      <nav className="bg-white border-b border-[#E0E0DA]">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between h-14">
          {/* Left: Logo + Tabs */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-display text-base font-bold tracking-wide text-[#0B0B0F] uppercase"
            >
              Face Library
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md font-body text-sm transition-colors ${
                    activeTab === tab
                      ? "bg-[#0B0B0F] text-[#FAFAF8] font-medium"
                      : "text-[#6B6B73] hover:text-[#0B0B0F] hover:bg-[#F5F5F0]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Right: User name */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0B0B0F] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#FAFAF8]" />
            </div>
            <span className="font-body text-sm font-medium text-[#0B0B0F]">
              {profile?.name || user?.name || "---"}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-[#0B0B0F]">
            Talent Dashboard
          </h1>
          <p className="font-body text-sm text-[#6B6B73] mt-1">
            Manage your digital likeness and incoming approvals
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

            {/* Profile Photo */}
            <div className="mb-4">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="w-full aspect-square rounded-lg object-cover border border-[#E0E0DA]"
                />
              ) : (
                <div className="w-full aspect-square rounded-lg bg-[#F5F5F0] border border-[#E0E0DA] flex items-center justify-center">
                  <User className="w-16 h-16 text-[#6B6B73]" />
                </div>
              )}
            </div>

            {/* Name + Tags */}
            <div className="mb-4">
              <p className="font-display text-base font-semibold text-[#0B0B0F]">
                {profile?.name || user?.name || "---"}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {allowed.length > 0 ? (
                  allowed.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#6B6B73]"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#6B6B73]">
                    No categories
                  </span>
                )}
                <span className="font-body text-[10px] px-2 py-0.5 rounded-full bg-[#1E3A5F] text-white font-medium">
                  Verified
                </span>
              </div>
            </div>

            {/* License Terms */}
            <div className="mb-5 space-y-3">
              <p className="font-body text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                License Terms
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-sm text-[#0B0B0F] block">
                    Regions
                  </span>
                  <span className="font-body text-xs text-[#6B6B73] capitalize">
                    {geoScope}
                  </span>
                </div>
                <Toggle
                  enabled={geoScope === "global"}
                  onToggle={() =>
                    setGeoScope(geoScope === "global" ? "uk" : "global")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-sm text-[#0B0B0F] block">
                    AI Rights
                  </span>
                  <span className="font-body text-xs text-[#6B6B73]">
                    {aiRights === "clothing_only" ? "Clothing only" : "Full"}
                  </span>
                </div>
                <Toggle
                  enabled={aiRights === "clothing_only"}
                  onToggle={() =>
                    setAiRights(
                      aiRights === "clothing_only" ? "full" : "clothing_only"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-sm text-[#0B0B0F] block">
                    Exclusivity
                  </span>
                  <span className="font-body text-xs text-[#6B6B73] capitalize">
                    {exclusivity}
                  </span>
                </div>
                <Toggle
                  enabled={exclusivity === "exclusive"}
                  onToggle={() =>
                    setExclusivity(
                      exclusivity === "exclusive"
                        ? "non_exclusive"
                        : "exclusive"
                    )
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mb-5">
              <button className="w-full flex items-center justify-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium py-2.5 rounded-md hover:bg-[#0B0B0F]/80 transition-colors focus:border-[#1E3A5F]">
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-[#E0E0DA] text-[#0B0B0F] font-body text-sm font-medium py-2.5 rounded-md hover:bg-[#F5F5F0] transition-colors focus:border-[#1E3A5F]">
                <Upload className="w-3.5 h-3.5" /> Upload Images
              </button>
            </div>

            {/* Connected Accounts */}
            <div>
              <p className="font-body text-xs font-semibold text-[#6B6B73] uppercase tracking-wider mb-3">
                Connected Accounts
              </p>
              <div className="space-y-2 font-body text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B6B73]">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </div>
                  <span className="text-[#0B0B0F] text-xs">
                    @{(profile?.name || "username").toLowerCase().replace(/\s/g, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B6B73]">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>TikTok</span>
                  </div>
                  <span className="text-[#0B0B0F] text-xs">
                    @{(profile?.name || "username").toLowerCase().replace(/\s/g, "")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B6B73]">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>YouTube</span>
                  </div>
                  <span className="text-[#0B0B0F] text-xs">---</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#6B6B73]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Agent</span>
                  </div>
                  <span className="text-[#0B0B0F] text-xs">---</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Center: License Passports --- */}
          <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
            <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-1">
              License Passports
            </h3>
            <p className="font-body text-xs text-[#6B6B73] mb-5">
              Allowed Campaigns
            </p>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {AD_CATEGORIES.map((cat) => {
                const isAllowed = allowed.includes(cat);
                const isBlocked = blocked.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-body transition-colors text-left ${
                      isBlocked
                        ? "border-red-300 bg-red-50"
                        : isAllowed
                        ? "border-green-300 bg-green-50"
                        : "border-[#E0E0DA] bg-white hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded flex items-center justify-center ${
                        isBlocked
                          ? "bg-red-200"
                          : isAllowed
                          ? "bg-green-200"
                          : "bg-[#E0E0DA]"
                      }`}
                    >
                      {isAllowed && (
                        <CheckCircle className="w-3 h-3 text-green-700" />
                      )}
                      {isBlocked && (
                        <XCircle className="w-3 h-3 text-red-700" />
                      )}
                    </span>
                    <span
                      className={`text-xs ${
                        isBlocked
                          ? "line-through text-[#6B6B73]"
                          : "text-[#0B0B0F]"
                      }`}
                    >
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Min price */}
            <div className="border-t border-[#E0E0DA] pt-4 mb-5">
              <p className="font-body text-xs text-[#6B6B73] mb-1">
                Minimum price per use
              </p>
              <p className="font-display text-xl font-bold text-[#0B0B0F]">
                {"\u00A3"}{profile?.min_price_per_use?.toLocaleString() ?? "0"}
              </p>
            </div>

            {/* Auto-approve toggle */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="font-body text-sm text-[#0B0B0F] block">
                  Auto-Approve
                </span>
                <span className="font-body text-xs text-[#6B6B73]">
                  Automatically approve matching requests
                </span>
              </div>
              <Toggle
                enabled={approvalMode === "auto"}
                onToggle={() =>
                  setApprovalMode(
                    approvalMode === "auto" ? "manual" : "auto"
                  )
                }
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium py-2.5 rounded-md hover:bg-[#0B0B0F]/80 transition-colors disabled:opacity-50 focus:border-[#1E3A5F]"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </button>

            <p className="font-body text-[10px] text-[#6B6B73] text-center mt-2">
              Click a category to cycle: allowed &rarr; blocked &rarr; off
            </p>
          </div>

          {/* --- Right: Active Licenses + Revenue --- */}
          <div className="space-y-6">
            {/* Active Licenses card */}
            <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
              <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5">
                Active Licenses
              </h3>

              {activeLicenses.length > 0 ? (
                <div className="space-y-3 mb-5">
                  {activeLicenses.slice(0, 3).map((lic) => (
                    <div
                      key={lic.id}
                      className="rounded-lg border border-[#E0E0DA] p-3"
                    >
                      <p className="font-body text-sm font-medium text-[#0B0B0F]">
                        {lic.brand_name}
                      </p>
                      <p className="font-body text-xs text-[#6B6B73] mt-0.5">
                        {(lic.license_type || lic.content_type || "standard").replace(/_/g, " ")} &middot;{" "}
                        {lic.desired_duration_days} days &middot;{" "}
                        {lic.desired_regions || "Global"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-body text-sm text-[#6B6B73] mb-5">
                  No active licenses yet.
                </p>
              )}

              {/* Revenue */}
              <div className="text-center py-4 rounded-lg bg-[#FAFAF8] border border-[#E0E0DA] mb-4">
                <p className="font-display text-3xl font-bold text-[#0B0B0F]">
                  {"\u00A3"}{totalRevenue.toLocaleString()}
                </p>
                <p className="font-body text-xs text-[#6B6B73] mt-1">
                  Total Revenue
                </p>
              </div>

              {/* Pending count */}
              <div className="flex items-center justify-between font-body text-sm py-2 border-b border-[#E0E0DA]">
                <span className="text-[#6B6B73]">Pending Requests</span>
                <span className="font-medium text-[#0B0B0F] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="flex items-center justify-between font-body text-sm py-2">
                <span className="text-[#6B6B73]">Watermarks Tracked</span>
                <span className="font-medium text-[#0B0B0F] text-xs">
                  {watermarks.length}
                </span>
              </div>
            </div>

            {/* Face Identity Certificate */}
            <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
              <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-3">
                Face Identity Certificate
              </h3>
              <div className="rounded-lg border-2 border-dashed border-[#E0E0DA] p-6 flex flex-col items-center justify-center text-center">
                <Shield className="w-8 h-8 text-[#6B6B73] mb-2" />
                <p className="font-body text-xs text-[#6B6B73]">
                  Your verified identity certificate will appear here once
                  approved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Row 2: Incoming License Requests ===== */}
        <div className="bg-white border border-[#E0E0DA] rounded-lg p-6">
          <h3 className="font-display text-sm font-semibold text-[#0B0B0F] mb-5">
            Incoming License Requests
          </h3>

          {requests.length === 0 ? (
            <p className="font-body text-sm text-[#6B6B73]">
              No incoming requests yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-[#E0E0DA]">
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Use Case
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Regions
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left py-2.5 pr-4 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-2.5 text-xs font-semibold text-[#6B6B73] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[#E0E0DA] last:border-0"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-medium text-[#0B0B0F]">
                          {r.brand_name}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[#6B6B73] text-xs max-w-[180px] truncate">
                        {r.use_case}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                            (r.license_type || "standard") === "exclusive"
                              ? "bg-purple-50 text-purple-700"
                              : (r.license_type || "standard") ===
                                "time_limited"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-[#F5F5F0] text-[#6B6B73]"
                          }`}
                        >
                          {(
                            r.license_type ||
                            r.content_type ||
                            "standard"
                          ).replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#6B6B73]">
                        {r.desired_duration_days}d
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#6B6B73]">
                        {r.desired_regions || "Global"}
                      </td>
                      <td className="py-3 pr-4 text-xs font-medium text-[#0B0B0F]">
                        {r.proposed_price != null
                          ? `\u00A3${r.proposed_price.toLocaleString()}`
                          : "---"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full capitalize font-medium ${
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
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(r.status === "awaiting_approval" ||
                            r.status === "pending") && (
                            <>
                              <button
                                onClick={() =>
                                  handleRequestAction(r.id, true)
                                }
                                className="flex items-center gap-1 font-body text-xs font-medium bg-green-600 text-white px-2.5 py-1.5 rounded-md hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle className="h-3 w-3" /> Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleRequestAction(r.id, false)
                                }
                                className="flex items-center gap-1 font-body text-xs font-medium bg-red-600 text-white px-2.5 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="h-3 w-3" /> Reject
                              </button>
                            </>
                          )}
                          <Link
                            href={`/license/${r.id}`}
                            className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] hover:underline ml-1"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
