"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { User, Globe, Clock, FileText, Download, Calendar } from "lucide-react";

const campaignDB: Record<string, { name: string; talent: string; talentImage: string; usage: string; duration: string; startDate: string; endDate: string; status: string; budget: string; platforms: string[]; description: string; deliverables: string[] }> = {
  "1": { name: "Spring Summer 2026", talent: "Sophia", talentImage: "https://images.unsplash.com/flagged/photo-1573582677725-863b570e3c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Social Media", duration: "3 months", startDate: "March 1, 2026", endDate: "May 31, 2026", status: "Active", budget: "$15,000", platforms: ["Instagram", "Facebook", "TikTok"], description: "Seasonal campaign promoting our new spring/summer collection.", deliverables: ["20 Instagram Posts", "10 Stories", "5 TikTok Videos", "Facebook Ads"] },
  "2": { name: "Holiday Campaign 2025", talent: "Maya", talentImage: "https://images.unsplash.com/photo-1654028859265-0e8b12a67aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Print & Digital", duration: "2 months", startDate: "Nov 1, 2025", endDate: "Dec 31, 2025", status: "Completed", budget: "$25,000", platforms: ["Print Ads", "Website", "Email"], description: "End-of-year holiday campaign with festive themes.", deliverables: ["Print Spread", "Website Banners", "Email Assets"] },
  "3": { name: "Tech Product Launch", talent: "Alex", talentImage: "https://images.unsplash.com/photo-1762522927402-f390672558d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Website & Social", duration: "6 months", startDate: "Jan 15, 2026", endDate: "Jul 15, 2026", status: "Active", budget: "$40,000", platforms: ["Website", "LinkedIn", "YouTube"], description: "Product launch targeting professional audiences.", deliverables: ["Demo Videos", "Hero Images", "LinkedIn Content", "YouTube Ads"] },
  "4": { name: "Fitness Brand Collab", talent: "Liam", talentImage: "https://images.unsplash.com/photo-1628258052805-196af609d397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Social & TV", duration: "4 months", startDate: "Apr 1, 2026", endDate: "Jul 31, 2026", status: "Pending", budget: "$50,000", platforms: ["TV", "Instagram", "YouTube"], description: "Fitness collaboration for athletic performance messaging.", deliverables: ["30s TV Commercial", "Reels Series", "YouTube Content"] },
  "5": { name: "Luxury Watch Campaign", talent: "Elena", talentImage: "https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Print & Website", duration: "5 months", startDate: "Feb 1, 2026", endDate: "Jun 30, 2026", status: "Active", budget: "$60,000", platforms: ["Print", "Website", "Digital Ads"], description: "Premium watch collection campaign.", deliverables: ["Print Ads", "Product Photography", "Display Ads"] },
  "6": { name: "Beauty Line Q1 2026", talent: "Zara", talentImage: "https://images.unsplash.com/photo-1633419798503-0b0c628f267c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300", usage: "Social Media", duration: "3 months", startDate: "Jan 1, 2026", endDate: "Mar 31, 2026", status: "Pending", budget: "$20,000", platforms: ["Instagram", "Pinterest", "YouTube"], description: "Beauty launch highlighting inclusive beauty.", deliverables: ["Instagram Series", "Pinterest Boards", "YouTube Tutorials"] },
};

const statusColor = (s: string) => s === "Active" ? "bg-green-100 text-green-700 border-green-200" : s === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "bg-gray-100 text-gray-700 border-gray-200";

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const campaign = campaignDB[id] || campaignDB["1"];

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
            <Link href="/campaigns" className="text-sm font-medium text-black border-b-2 border-black pb-1">Campaigns</Link>
          </nav>
          <Link href="/campaigns" className="text-sm text-gray-600 hover:text-black">&larr; Back to Campaigns</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-semibold">{campaign.name}</h1>
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${statusColor(campaign.status)}`}>{campaign.status}</span>
          </div>
          <p className="text-gray-600">{campaign.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-gray-600" /><h3 className="font-semibold">Selected Talent</h3></div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.talentImage} alt={campaign.talent} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium">{campaign.talent}</p>
                <button onClick={() => router.push(`/talent-profile/${id}`)} className="text-sm text-blue-600 hover:underline">View Profile</button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-gray-600" /><h3 className="font-semibold">Duration</h3></div>
            <div className="space-y-2">
              <div><p className="text-xs text-gray-600">Start</p><p className="font-medium">{campaign.startDate}</p></div>
              <div><p className="text-xs text-gray-600">End</p><p className="font-medium">{campaign.endDate}</p></div>
              <div className="pt-2 border-t border-gray-200"><p className="text-sm font-medium">{campaign.duration}</p></div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-gray-600" /><h3 className="font-semibold">Budget</h3></div>
            <p className="text-2xl font-semibold">{campaign.budget}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><Globe className="w-5 h-5 text-gray-600" /><h3 className="font-semibold">Usage & Platforms</h3></div>
            <p className="font-medium mb-3">{campaign.usage}</p>
            <div className="flex flex-wrap gap-2">
              {campaign.platforms.map((p) => <span key={p} className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm">{p}</span>)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-gray-600" /><h3 className="font-semibold">Deliverables</h3></div>
            <ul className="space-y-2">
              {campaign.deliverables.map((d) => <li key={d} className="flex items-start gap-2"><span className="text-gray-400">&bull;</span><span className="text-sm text-gray-700">{d}</span></li>)}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
            <Download className="w-4 h-4" /> Download Contract
          </button>
          <button className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-black hover:text-black transition-colors font-medium text-sm">
            Edit Campaign
          </button>
        </div>
      </main>
    </div>
  );
}
