"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const campaigns = [
  { id: "1", name: "Spring Summer 2026", talent: "Sophia", usage: "Social Media", duration: "3 months", status: "Active" as const },
  { id: "2", name: "Holiday Campaign 2025", talent: "Maya", usage: "Print & Digital", duration: "2 months", status: "Completed" as const },
  { id: "3", name: "Tech Product Launch", talent: "Alex", usage: "Website & Social Media", duration: "6 months", status: "Active" as const },
  { id: "4", name: "Fitness Brand Collab", talent: "Liam", usage: "Social Media & TV", duration: "4 months", status: "Pending" as const },
  { id: "5", name: "Luxury Watch Campaign", talent: "Elena", usage: "Print & Website", duration: "5 months", status: "Active" as const },
  { id: "6", name: "Beauty Line Q1 2026", talent: "Zara", usage: "Social Media", duration: "3 months", status: "Pending" as const },
];

const statusColor = (s: string) => s === "Active" ? "bg-green-100 text-green-700 border-green-200" : s === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-700 border-gray-200";

export default function CampaignsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-xs font-bold">FL</div>
            <span className="font-semibold text-base tracking-wide">FACE LIBRARY</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/client/dashboard" className="text-sm text-gray-600 hover:text-black">Dashboard</Link>
            <Link href="/discover-talent" className="text-sm text-gray-600 hover:text-black">Discover Talent</Link>
            <span className="text-sm font-medium text-black border-b-2 border-black pb-1">Campaigns</span>
          </nav>
          <Link href="/client/dashboard" className="text-sm text-gray-600 hover:text-black">&larr; Back</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Campaigns</h1>
            <p className="text-gray-600">Manage all your active and past campaigns</p>
          </div>
          <button onClick={() => router.push("/client/dashboard")} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" /> Create Campaign
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/campaign/${c.id}`} className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all border border-gray-200 hover:border-gray-300 block">
              <h3 className="text-lg font-semibold mb-4">{c.name}</h3>
              <div className="space-y-2.5 mb-4">
                <div className="flex"><span className="text-sm text-gray-600 w-32">Selected Talent:</span><span className="text-sm font-medium">{c.talent}</span></div>
                <div className="flex"><span className="text-sm text-gray-600 w-32">Usage:</span><span className="text-sm font-medium">{c.usage}</span></div>
                <div className="flex"><span className="text-sm text-gray-600 w-32">Duration:</span><span className="text-sm font-medium">{c.duration}</span></div>
                <div className="flex"><span className="text-sm text-gray-600 w-32">Status:</span><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(c.status)}`}>{c.status}</span></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
