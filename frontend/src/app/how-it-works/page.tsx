"use client";

import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Sparkles,
  Settings2,
  FileCheck,
  BadgeDollarSign,
  ArrowRight,
  Globe,
  Users,
  Scale,
  Lock,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Claim Your Profile",
    desc: "Sign up as talent, submit your details, and create your digital identity on Face Library.",
    color: "from-blue-500/20 to-blue-900/10",
  },
  {
    num: "02",
    icon: ShieldCheck,
    title: "Verify Identity",
    desc: "Complete identity verification so clients know your likeness is authentic and protected.",
    color: "from-emerald-500/20 to-emerald-900/10",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Create Face Avatar",
    desc: "Upload high-quality photos of your likeness for use in AI-generated campaigns.",
    color: "from-purple-500/20 to-purple-900/10",
  },
  {
    num: "04",
    icon: Settings2,
    title: "Set Permissions",
    desc: "Control exactly how your face can be used — categories, regions, durations, and exclusivity.",
    color: "from-amber-500/20 to-amber-900/10",
  },
  {
    num: "05",
    icon: FileCheck,
    title: "License & Approve",
    desc: "Review incoming requests from clients. AI-generated UK-law contracts protect your rights.",
    color: "from-cyan-500/20 to-cyan-900/10",
  },
  {
    num: "06",
    icon: BadgeDollarSign,
    title: "License & Get Paid",
    desc: "Approve campaigns and receive 90% of licensing fees directly via Stripe.",
    color: "from-green-500/20 to-green-900/10",
  },
];

const stats = [
  { icon: Lock, value: "1K+", label: "Protected Identities" },
  { icon: Users, value: "50,000+", label: "Talent & Creators" },
  { icon: Scale, value: "UK & Digital", label: "Compliant" },
  { icon: Globe, value: "Full Rights", label: "Protection" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 lg:px-16 h-20 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
            <span className="font-display text-lg font-bold italic text-white">FL</span>
          </div>
          <span className="font-body text-sm font-bold tracking-[0.2em] text-white">
            FACE LIBRARY
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-body text-sm text-white/60 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/talent/library" className="font-body text-sm text-white/60 hover:text-white transition-colors">
            Face Library
          </Link>
          <Link href="#" className="font-body text-sm text-white/60 hover:text-white transition-colors">
            For You
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="font-body text-sm text-white/60 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex font-body text-sm font-medium text-[#0B0B0F] bg-white px-5 py-2 rounded-full hover:bg-white/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#1E3A5F]/10 blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-6 pt-20 pb-16 text-center max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
              <ShieldCheck className="w-3.5 h-3.5" /> AI Deep Identity
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
              <Sparkles className="w-3.5 h-3.5" /> Full-Spectrum
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
              <BadgeDollarSign className="w-3.5 h-3.5" /> Earn From Your Likeness
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight mb-6">
            Protect, Create, and License
            <br />
            <span className="italic text-white/80">Your Digital Likeness.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10">
            Verify your identity. Build your avatar, control usage,
            and get paid for likeness campaigns.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/talent/register"
              className="inline-flex items-center gap-2 bg-white text-[#0B0B0F] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-white/90 transition-colors"
            >
              Register as Talent
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/client/register"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-white/10 transition-colors"
            >
              License a Likeness
            </Link>
          </div>
        </div>
      </section>

      {/* Horizontal Pipeline */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-white/40 text-center mb-12">
            How it works — your journey from sign-up to payout
          </p>
        </div>

        {/* Scrollable pipeline container */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-start gap-0 min-w-max px-6 lg:px-0 lg:justify-center mx-auto max-w-7xl">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-start">
                  {/* Step card */}
                  <div className="relative flex flex-col items-center w-[180px] group">
                    {/* Icon card */}
                    <div
                      className={`relative w-[160px] h-[120px] rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex items-center justify-center mb-4 group-hover:border-white/25 group-hover:bg-white/[0.06] transition-all duration-300`}
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-60`} />
                      {/* Step number watermark */}
                      <span className="absolute top-2 right-3 font-display text-[40px] font-bold text-white/[0.06] leading-none">
                        {step.num}
                      </span>
                      {/* Icon */}
                      <step.icon className="relative z-10 w-10 h-10 text-white/70 group-hover:text-white/90 transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-sm font-semibold text-white text-center mb-1.5 leading-tight">
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="font-body text-[11px] text-white/40 text-center leading-relaxed px-1 max-w-[160px]">
                      {step.desc}
                    </p>
                  </div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="flex items-center self-start mt-[52px] px-1">
                      <div className="relative w-[40px] h-[2px]">
                        {/* Line */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full" />
                        {/* Arrowhead */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white/25" />
                        {/* Glow dot at start */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fade edges for scroll indication on mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0B0B0F] to-transparent pointer-events-none lg:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0B0B0F] to-transparent pointer-events-none lg:hidden" />
        </div>
      </section>

      {/* Revenue highlight */}
      <section className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-br from-[#1E3A5F]/20 to-transparent p-12 text-center">
          <p className="font-body text-sm text-white/40 uppercase tracking-[0.2em] mb-4">
            Average talent earnings
          </p>
          <p className="font-display text-6xl md:text-7xl font-light text-white mb-4">
            $12,480
          </p>
          <p className="font-body text-sm text-white/40 max-w-md mx-auto">
            Per quarter from likeness licensing. You set the price,
            approve every use, and receive 90% of every payment.
          </p>
        </div>
      </section>

      {/* Bottom stats */}
      <section className="border-t border-white/10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-6 h-6 text-white/30 mx-auto mb-3" />
                <p className="font-display text-2xl font-semibold text-white mb-1">
                  {stat.value}
                </p>
                <p className="font-body text-xs text-white/40 uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
          Ready to protect your likeness?
        </h2>
        <p className="font-body text-white/40 mb-8 max-w-md mx-auto">
          Join thousands of creators who control how their identity is used in the age of AI.
        </p>
        <Link
          href="/talent/register"
          className="inline-flex items-center gap-2 bg-white text-[#0B0B0F] font-body text-sm font-medium tracking-wide py-3.5 px-8 rounded-full hover:bg-white/90 transition-colors"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30">
              <span className="font-display text-[10px] font-bold italic text-white/60">FL</span>
            </div>
            <span className="font-body text-xs text-white/40">&copy; 2026 Face Library</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/talent/library" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
              Talent Library
            </Link>
            <Link href="#" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>

      {/* Custom scrollbar hide utility */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
