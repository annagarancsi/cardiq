"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Building2, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CardIQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome! Let&apos;s get started</h1>
          <p className="text-gray-500 text-sm">How would you like to set up your card portfolio?</p>
        </div>

        <div className="space-y-4">
          {/* Plaid option */}
          <button
            onClick={() => router.push("/onboarding/plaid")}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md hover:border-brand-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-semibold text-gray-900">Connect Bank Account</h2>
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Securely connect via Plaid to automatically import your cards and transactions. Takes 2 minutes.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                    Bank-level security
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                    Auto transaction import
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                    Read-only access
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors shrink-0 mt-1" />
            </div>
          </button>

          {/* Manual option */}
          <button
            onClick={() => router.push("/onboarding/manual")}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md hover:border-brand-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-200 transition-colors">
                <CreditCard className="w-6 h-6 text-brand-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Add Cards Manually</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Choose your cards from our catalog and track benefits manually. No bank connection needed.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full inline-block" />
                    Full privacy
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full inline-block" />
                    20+ cards supported
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors shrink-0 mt-1" />
            </div>
          </button>

          {/* Skip */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Skip for now — explore with demo data
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 justify-center text-xs text-gray-400">
          <Sparkles className="w-3 h-3" />
          AI-powered benefit tracking — powered by Claude
        </div>
      </div>
    </div>
  );
}
