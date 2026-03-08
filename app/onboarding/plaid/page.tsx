"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Shield, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

const MOCK_BANKS = [
  { id: "chase", name: "Chase", logo: "🏦" },
  { id: "amex", name: "American Express", logo: "💳" },
  { id: "citi", name: "Citi", logo: "🏛️" },
  { id: "bofa", name: "Bank of America", logo: "🔴" },
  { id: "capital-one", name: "Capital One", logo: "⚡" },
  { id: "wells-fargo", name: "Wells Fargo", logo: "🐎" },
  { id: "discover", name: "Discover", logo: "🟠" },
  { id: "usbank", name: "US Bank", logo: "🇺🇸" },
];

type Step = "select-bank" | "credentials" | "connecting" | "success";

export default function PlaidOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select-bank");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  function handleBankSelect(bankId: string) {
    setSelectedBank(bankId);
    setStep("credentials");
  }

  function handleConnect() {
    setStep("connecting");
    // Simulate connection delay
    setTimeout(() => setStep("success"), 2500);
  }

  function handleDone() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Select bank */}
        {step === "select-bank" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Connect your bank</h1>
                <p className="text-xs text-gray-400">Secured by Plaid · Read-only access</p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2 mb-4">
                <Shield className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-xs text-green-700">
                  CardIQ never sees your bank password. Plaid uses 256-bit encryption.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MOCK_BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition-all text-left"
                  >
                    <span className="text-2xl">{bank.logo}</span>
                    <span className="text-sm font-medium text-gray-700">{bank.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Don&apos;t see your bank?{" "}
                <button
                  onClick={() => router.push("/onboarding/manual")}
                  className="text-brand-600 hover:underline"
                >
                  Add cards manually
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Credentials (mock Plaid UI) */}
        {step === "credentials" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setStep("select-bank")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  {MOCK_BANKS.find((b) => b.id === selectedBank)?.name}
                </h1>
                <p className="text-xs text-gray-400">Enter your online banking credentials</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700">
                  Your credentials are encrypted and sent directly to{" "}
                  {MOCK_BANKS.find((b) => b.id === selectedBank)?.name}. CardIQ never receives them.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" className="input" placeholder="Online banking username" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>

              <button onClick={handleConnect} className="btn-primary w-full py-2.5">
                Connect securely
              </button>

              <p className="text-center text-xs text-gray-400">
                By connecting, you agree to Plaid&apos;s{" "}
                <span className="text-brand-600">Terms of Service</span> and{" "}
                <span className="text-brand-600">Privacy Policy</span>
              </p>
            </div>
          </div>
        )}

        {/* Connecting */}
        {step === "connecting" && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connecting securely…</h2>
            <p className="text-sm text-gray-400">
              Importing your cards and recent transactions
            </p>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connected!</h2>
            <p className="text-sm text-gray-500 mb-2">
              We found <strong>3 credit cards</strong> and imported{" "}
              <strong>30 recent transactions</strong>.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              CardIQ will now track your benefits and optimize your spending automatically.
            </p>
            <button onClick={handleDone} className="btn-primary w-full py-2.5">
              Go to my Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
