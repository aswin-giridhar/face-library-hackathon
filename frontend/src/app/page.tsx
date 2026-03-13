/**
 * Landing Page — Face Library MVP.
 * Matches wireframe: "Protect and License Faces in the Age of AI"
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  Eye,
  Scale,
  Search,
  ArrowRight,
  ChevronRight,
  Lock,
  User,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Camera,
  CheckCircle,
  Fingerprint,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

/* -- Role Card ----------------------------------------------------------- */
function RoleCard({
  title,
  description,
  features,
  cta,
  href,
  accent = false,
}: {
  title: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <div className="card-lift rounded-xl border border-[#E0E0DA] bg-white p-8 flex flex-col">
      <h3 className="font-display text-lg font-bold tracking-wide text-[#0B0B0F]">
        {title}
      </h3>
      <p className="text-sm text-[#6B6B73] mt-2 mb-6">{description}</p>
      <ul className="space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-[#0B0B0F]">
            <CheckCircle className="w-4 h-4 text-[#1E3A5F] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          href={href}
          className={`w-full inline-flex items-center justify-center gap-2 font-body text-sm font-medium tracking-wide py-3 px-6 rounded-full transition-colors duration-300 ${
            accent
              ? "bg-[#1E3A5F] text-[#FAFAF8] hover:bg-[#1E3A5F]/90"
              : "bg-[#0B0B0F] text-[#FAFAF8] hover:bg-[#0B0B0F]/90"
          }`}
        >
          {cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* -- Page ----------------------------------------------------------------- */
export default function HomePage() {
  const { user } = useAuth();

  const dashboardPath = user?.role === "talent"
    ? "/talent/dashboard"
    : user?.role === "client" || user?.role === "brand"
    ? "/client/dashboard"
    : user?.role === "agent"
    ? "/agent/dashboard"
    : "/";

  return (
    <div className="min-h-screen bg-[#FAFAF8] relative noise-bg">
      {/* -- Navigation -- */}
      <nav className="relative z-10 flex items-center justify-between px-8 lg:px-16 h-20 border-b border-[#E0E0DA] bg-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0B0B0F]">
            <span className="font-display text-xl font-bold italic text-[#0B0B0F]">FL</span>
          </div>
          <div className="flex flex-col">
            <span className="font-body text-lg font-bold tracking-[0.2em] text-[#0B0B0F]">
              FACE LIBRARY
            </span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          {user && (
            <Link href={dashboardPath} className="font-body text-sm text-[#1E3A5F] font-medium hover:text-[#0B0B0F] transition-colors">
              Dashboard
            </Link>
          )}
          <Link href="/talent/library" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">Library</Link>
          <Link href="#how-it-works" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">How It Works</Link>
          <Link href="#for-you" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">For You</Link>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/login" className="font-body text-sm text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hidden sm:inline-flex font-body text-sm font-medium text-[#FAFAF8] bg-[#0B0B0F] px-5 py-2 rounded-full hover:bg-[#0B0B0F]/90 transition-colors">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="font-body text-sm text-[#6B6B73]">{user.name}</span>
              <Link href={dashboardPath} className="hidden sm:inline-flex font-body text-sm font-medium text-[#FAFAF8] bg-[#0B0B0F] px-5 py-2 rounded-full hover:bg-[#0B0B0F]/90 transition-colors">
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* -- Hero -- */}
      <section className="relative z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto flex flex-col items-center px-6 py-16 md:py-20">
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
            <h1 className="animate-reveal animate-reveal-1 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#0B0B0F] md:text-5xl lg:text-6xl">
              Protect and License Faces
              <br />
              <span className="italic">in the Age of AI</span>
            </h1>
            <p className="animate-reveal animate-reveal-2 font-body text-base text-[#6B6B73] mt-6 max-w-xl leading-relaxed">
              Verify, certify, license digital likeness,
              and track its use across apps or clients.
            </p>
            <div className="animate-reveal animate-reveal-3 flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/talent/register"
                className="inline-flex items-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-[#1E3A5F] transition-colors duration-300"
              >
                Register as Talent
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/client/register"
                className="inline-flex items-center gap-2 border border-[#0B0B0F] text-[#0B0B0F] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-[#0B0B0F] hover:text-[#FAFAF8] transition-all duration-300"
              >
                License a Likeness
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative z-0 mt-10 w-full max-w-4xl animate-reveal animate-reveal-4">
            <Image
              src="/hero-group.png"
              alt="Face Library — digital faces rendered for licensing"
              width={1200}
              height={520}
              className="w-full h-auto object-contain max-h-[520px] mx-auto"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* -- How It Works (4 steps) -- */}
      <section id="how-it-works" className="relative z-10 bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl font-semibold text-center text-[#0B0B0F] mb-12">
            How it Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", icon: Camera, label: "Register", desc: "Submit your face and profile information" },
              { step: "2", icon: ShieldCheck, label: "Verify", desc: "Identity verification and preference setup" },
              { step: "3", icon: FileText, label: "License", desc: "AI-generated contracts with UK law compliance" },
              { step: "4", icon: Eye, label: "Track", desc: "Watermark tracking and usage monitoring" },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#0B0B0F] flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-[#FAFAF8]" />
                </div>
                <p className="font-body text-xs text-[#1E3A5F] font-medium mb-1">{s.step}.</p>
                <h3 className="font-body text-sm font-semibold text-[#0B0B0F]">{s.label}</h3>
                <p className="font-body text-xs text-[#6B6B73] mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Verified Faces (Talent Library Preview) -- */}
      <section className="relative z-10 bg-[#FAFAF8] py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-semibold text-[#0B0B0F]">
              Verified Faces Available for Licensing
            </h2>
            <Link href="/talent/library" className="font-body text-sm text-[#1E3A5F] hover:underline flex items-center gap-1">
              Explore All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-[#E0E0DA]/50 border border-[#E0E0DA] overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[#6B6B73]/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Role Cards -- */}
      <section id="for-you" className="relative z-10 px-8 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B0B0F]">
              Built for every side of the licensing equation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard
              title="For Talent"
              description="Register, verify, and control your likeness."
              features={[
                "Upload your face photo",
                "Set licensing preferences",
                "Approve every use",
                "Track with watermarks",
              ]}
              cta="Apply as Talent"
              href="/talent/register"
            />
            <RoleCard
              title="For Agents"
              description="Manage your talent roster and approvals."
              features={[
                "Manage talent roster",
                "Centralized approvals",
                "Review license requests",
                "Contract templates",
              ]}
              cta="Apply as Agent"
              href="/agent/register"
            />
            <RoleCard
              title="For Clients"
              description="Search and license digital likeness for campaigns."
              features={[
                "Browse talent library",
                "Submit license requests",
                "AI-generated contracts",
                "Stripe payments",
              ]}
              cta="Get Started"
              href="/client/register"
              accent
            />
          </div>
        </div>
      </section>

      {/* -- Platform Features (dark section) -- */}
      <section className="relative z-10 bg-[#0B0B0F] text-[#FAFAF8]">
        <div className="px-8 lg:px-16 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center mb-16">
              Protect, Create, and License
              <br />
              <span className="italic">Your Digital Likeness</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: "IP Protection", desc: "UK-law-compliant contracts with GDPR compliance, moral rights, and AI training restrictions." },
                { icon: Fingerprint, title: "Watermark Tracking", desc: "Track where your licensed content appears. Detect unauthorized use across platforms." },
                { icon: CreditCard, title: "Stripe Payments", desc: "Secure payment processing. 90% goes to talent, 10% platform fee." },
                { icon: FileText, title: "3 License Types", desc: "Standard, Exclusive, and Time-Limited options to fit every campaign need." },
                { icon: Scale, title: "Manual Review", desc: "Every request goes through manual review before talent approval. No automated decisions." },
                { icon: Lock, title: "Full Audit Trail", desc: "Complete history of every action, from request creation to payment completion." },
              ].map((f) => (
                <div key={f.title} className="p-6 rounded-lg border border-white/10">
                  <f.icon className="w-8 h-8 text-[#FAFAF8]/60 mb-4" />
                  <h3 className="font-body text-sm font-semibold text-white mb-2">{f.title}</h3>
                  <p className="font-body text-xs text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="font-display text-4xl font-light italic mb-2">3</p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#FAFAF8]/60">License Types</p>
              </div>
              <div>
                <p className="font-display text-4xl font-light italic mb-2">UK Law</p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#FAFAF8]/60">Compliant Contracts</p>
              </div>
              <div>
                <p className="font-display text-4xl font-light italic mb-2">100%</p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#FAFAF8]/60">Secure & Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- CTA -- */}
      <section className="relative z-10 px-8 lg:px-16 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-light text-[#0B0B0F] leading-tight mb-4">
            Your likeness,
            <br />
            <span className="italic">your terms</span>
          </h2>
          <p className="font-body text-[#6B6B73] mb-8 max-w-md mx-auto leading-relaxed">
            Join the platform where creators control how their identity is used
            in the age of generative AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/talent/register"
              className="inline-flex items-center gap-2 bg-[#0B0B0F] text-[#FAFAF8] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-[#1E3A5F] transition-colors duration-300"
            >
              Apply as Talent
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/client/register"
              className="inline-flex items-center gap-2 border border-[#0B0B0F] text-[#0B0B0F] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-[#0B0B0F] hover:text-[#FAFAF8] transition-all duration-300"
            >
              License a Likeness
            </Link>
          </div>
        </div>
      </section>

      {/* -- Footer -- */}
      <footer className="relative z-10 border-t border-[#E0E0DA] bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#6B6B73]">
                <span className="font-display text-[10px] font-bold italic text-[#6B6B73]">FL</span>
              </div>
              <span className="font-body text-xs text-[#6B6B73]">
                &copy; 2026 Face Library
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/talent/library" className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
                Talent Library
              </Link>
              <Link href="#" className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
                Privacy
              </Link>
              <Link href="#" className="font-body text-xs text-[#6B6B73] hover:text-[#0B0B0F] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
