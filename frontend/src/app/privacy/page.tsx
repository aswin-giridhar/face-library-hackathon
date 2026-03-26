"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-gray-600 hover:text-black mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-medium mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2">1. Introduction</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Face Library Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal data when you use our platform.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">2. Data We Collect</h3>
            <p className="text-gray-700 text-sm leading-relaxed">We collect: account information (name, email, role), profile data (photos, social media links), usage data (how you interact with our platform), and payment information (processed securely via Stripe).</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">3. How We Use Your Data</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Your data is used to: operate and improve our platform, process licensing requests and payments, verify identity, communicate with you about your account, and comply with legal obligations.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">4. Digital Likeness Data</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Photos and likeness data uploaded by talent are stored securely and only shared with clients who have approved licensing agreements. We do not sell or share likeness data without explicit consent.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">5. Data Security</h3>
            <p className="text-gray-700 text-sm leading-relaxed">We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">6. Your Rights</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Under GDPR, you have the right to access, correct, delete, or port your personal data. Contact us at privacy@facelibrary.com to exercise these rights.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">7. Contact</h3>
            <p className="text-gray-700 text-sm leading-relaxed">For privacy inquiries, contact Face Library Ltd, London, UK. Email: privacy@facelibrary.com</p>
          </section>
          <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">Last Updated: March 19, 2026</p>
        </div>
      </div>
    </div>
  );
}
