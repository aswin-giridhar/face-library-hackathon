"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-gray-600 hover:text-black mb-6 inline-block">&larr; Back to Home</Link>
        <h1 className="text-3xl font-medium mb-8">Client Terms and Conditions</h1>
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2">1. Acceptance of Terms</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Face Library Ltd operates the platform located at face-library.com and related services. These Client Terms and Conditions form a binding agreement between you and Face Library Ltd. By accessing or using the Service you confirm that you have read, understood and agree to these terms.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">2. The Service</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Face Library provides a platform through which clients may discover talent and request licenses for the use of digital likeness materials including images, avatars, and AI-generated outputs derived from approved materials.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">3. No Transfer of Ownership</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Face Library does not sell ownership of a person&apos;s likeness. Clients only receive limited rights to use approved digital likeness materials according to the scope of rights granted. Unless otherwise stated, licenses are limited, non-exclusive, non-transferable, non-sublicensable, time-bound, and use-restricted.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">4. AI and Synthetic Media Use</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Any use of artificial intelligence technologies must be explicitly disclosed during the license request process. Clients may not use any likeness materials for AI training or derivative content creation unless expressly authorized.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">5. Payments</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Where applicable clients agree to pay all licensing fees, platform fees and applicable taxes. No license becomes valid until payment obligations are fulfilled.</p>
          </section>
          <section>
            <h3 className="text-lg font-medium mb-2">6. Governing Law</h3>
            <p className="text-gray-700 text-sm leading-relaxed">These terms are governed by the laws of England and Wales. Any disputes shall be resolved under the jurisdiction of the courts of England and Wales.</p>
          </section>
          <p className="text-sm text-gray-500 pt-4 border-t border-gray-200">Last Updated: March 19, 2026</p>
        </div>
      </div>
    </div>
  );
}
