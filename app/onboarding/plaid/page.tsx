"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

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

// Cards that get auto-imported per bank (mix of issuers for realism)
const PLAID_IMPORTED_CARDS: Record<string, string[]> = {
  chase: ["chase-sapphire-reserve", "chase-freedom-unlimited", "amex-gold"],
  amex: ["amex-platinum", "amex-gold", "chase-sapphire-preferred"],
  citi: ["citi-double-cash", "chase-sapphire-preferred", "capital-one-venture-x"],
  bofa: ["chase-freedom-flex", "citi-double-cash", "amex-gold"],
  "capital-one": ["capital-one-venture-x", "chase-freedom-unlimited", "citi-double-cash"],
  "wells-fargo": ["chase-sapphire-preferred", "amex-gold", "citi-double-cash"],
  discover: ["chase-freedom-flex", "citi-double-cash", "capital-one-venture-x"],
  usbank: ["chase-sapphire-reserve", "amex-platinum", "citi-double-cash"],
};

type Step = "select-bank" | "credentials" | "connecting" | "success";

export default function PlaidOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select-bank");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [importedCount, setImportedCount] = useState(0);

  function handleBankSelect(bankId: string) {
    setSelectedBank(bankId);
    setStep("credentials");
  }

  async function handleConnect() {
    setStep("connecting");

    // Simulate connection delay, then save cards
    await new Promise((res) => setTimeout(res, 2500));

    // Save the mock imported cards for this bank
    const cardsToImport = PLAID_IMPORTED_CARDS[selectedBank ?? "chase"] ?? [];
    for (const cardId of cardsToImport) {
      await fetch("/api/cards/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
    }

    setImportedCount(cardsToImport.length);
    setStep("success");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Step 1 — Select bank */}
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

        {/* Step 2 — Credentials */}
        {step === "credentials" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setStep("select-bank")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{MOCK_BANKS.find((b) => b.id === selectedBank)?.logo}</span>
                <div>
                  <h1 className="text-base font-semibold text-gray-900">
                    {MOCK_BANKS.find((b) => b.id === selectedBank)?.name}
                  </h1>
                  <p className="text-xs text-gray-400">Enter your online banking credentials</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700">
                  Your credentials go directly to {MOCK_BANKS.find((b) => b.id === selectedBank)?.name}. CardIQ never receives them.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Online banking username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={!username || !password}
                className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                  username && password ? "btn-primary" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Connect securely
              </button>

              <p className="text-center text-xs text-gray-400">
                By connecting, you agree to Plaid&apos;s{" "}
                <span className="text-brand-600 cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-brand-600 cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Connecting animation */}
        {step === "connecting" && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connecting securely…</h2>
            <p className="text-sm text-gray-400">Importing your cards and recent transactions</p>
            <div className="mt-6 space-y-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-gray-400">Scanning accounts…</p>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === "success" && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connected!</h2>
            <p className="text-sm text-gray-500 mb-1">
              We found <strong>{importedCount} credit cards</strong> and imported{" "}
              <strong>30 recent transactions</strong>.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              CardIQ will now track your benefits and help you maximize every perk.
            </p>

            {/* Card summary chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {(PLAID_IMPORTED_CARDS[selectedBank ?? "chase"] ?? []).map((cardId) => (
                <span key={cardId} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full font-medium">
                  {cardId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </span>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full py-2.5"
            >
              Go to my Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
