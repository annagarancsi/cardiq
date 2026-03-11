"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import { formatCurrency } from "@/lib/utils";
import type { CardBenefit, CardCatalogEntry } from "@/types";

interface BenefitWithCard extends CardBenefit {
  cardName: string;
  cardColor: string;
}

interface CardGroup {
  card: CardCatalogEntry;
  benefits: CardBenefit[];
  expanded: boolean;
}

export default function ReviewBenefitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cardGroups, setCardGroups] = useState<CardGroup[]>([]);
  const [disabledBenefitIds, setDisabledBenefitIds] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const cardIdsParam = searchParams.get("cards");
    if (!cardIdsParam) {
      router.push("/dashboard");
      return;
    }

    const cardIds = cardIdsParam.split(",").filter(Boolean);
    const groups: CardGroup[] = cardIds
      .map((id) => CARD_CATALOG.find((c) => c.id === id))
      .filter((c): c is CardCatalogEntry => !!c)
      .map((card) => ({ card, benefits: card.benefits, expanded: true }));

    setCardGroups(groups);
  }, [searchParams, router]);

  function toggleBenefit(benefitId: string) {
    setDisabledBenefitIds((prev) => {
      const next = new Set(prev);
      if (next.has(benefitId)) next.delete(benefitId);
      else next.add(benefitId);
      return next;
    });
  }

  function toggleExpanded(cardId: string) {
    setCardGroups((prev) =>
      prev.map((g) =>
        g.card.id === cardId ? { ...g, expanded: !g.expanded } : g
      )
    );
  }

  async function handleConfirm() {
    setConfirming(true);

    // Delete any benefits the user removed
    // (Benefits are tracked per-benefit; removing means we just don't create a tracking entry.
    //  For now, disabled benefits are simply excluded from the dashboard by removing them from
    //  the user's benefit tracking. We note the disabled IDs in localStorage so the dashboard
    //  can respect them on first load.)
    const disabled = Array.from(disabledBenefitIds);
    if (disabled.length > 0) {
      try {
        localStorage.setItem("cardiq_disabled_benefits", JSON.stringify(disabled));
      } catch {
        // ignore storage errors
      }
    }

    router.push("/dashboard");
  }

  const allBenefits = cardGroups.flatMap((g) => g.benefits);
  const enabledBenefits = allBenefits.filter((b) => !disabledBenefitIds.has(b.id));
  const totalValue = enabledBenefits.reduce((s, b) => s + b.dollarValue, 0);
  const totalCards = cardGroups.length;

  if (cardGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Review your benefits</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  We found <strong>{allBenefits.length} benefits</strong> across{" "}
                  <strong>{totalCards} card{totalCards !== 1 ? "s" : ""}</strong>. Remove any that don&apos;t apply to you.
                </p>
              </div>
            </div>

            {/* Summary bar */}
            <div className="flex items-center gap-4 bg-brand-50 rounded-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-xs text-brand-600 font-medium">Benefits enabled</p>
                <p className="text-lg font-bold text-brand-700">{enabledBenefits.length} / {allBenefits.length}</p>
              </div>
              <div className="w-px h-8 bg-brand-200" />
              <div className="flex-1">
                <p className="text-xs text-brand-600 font-medium">Total annual value</p>
                <p className="text-lg font-bold text-brand-700">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          {/* Scrollable benefit list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cardGroups.map(({ card, benefits, expanded }) => {
              const cardEnabled = benefits.filter((b) => !disabledBenefitIds.has(b.id)).length;
              return (
                <div key={card.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Card header row */}
                  <button
                    onClick={() => toggleExpanded(card.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} shrink-0`} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900">{card.name}</p>
                      <p className="text-xs text-gray-400">
                        {cardEnabled} of {benefits.length} benefit{benefits.length !== 1 ? "s" : ""} enabled
                      </p>
                    </div>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Benefit rows */}
                  {expanded && (
                    <div className="divide-y divide-gray-50">
                      {benefits.map((benefit) => {
                        const isEnabled = !disabledBenefitIds.has(benefit.id);
                        return (
                          <div
                            key={benefit.id}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              isEnabled ? "bg-white" : "bg-gray-50 opacity-60"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isEnabled ? "text-gray-900" : "text-gray-400 line-through"}`}>
                                {benefit.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{benefit.description}</p>
                            </div>
                            <span className={`text-sm font-semibold shrink-0 ${isEnabled ? "text-green-600" : "text-gray-300"}`}>
                              {formatCurrency(benefit.dollarValue)}
                            </span>
                            <button
                              onClick={() => toggleBenefit(benefit.id)}
                              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isEnabled
                                  ? "border-brand-600 bg-brand-600 hover:bg-red-500 hover:border-red-500"
                                  : "border-gray-300 bg-white hover:border-brand-400"
                              }`}
                              title={isEnabled ? "Remove this benefit" : "Re-enable this benefit"}
                            >
                              {isEnabled ? (
                                <X className="w-3 h-3 text-white" strokeWidth={3} />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5 text-gray-300" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100 shrink-0 space-y-2">
            {disabledBenefitIds.size > 0 && (
              <p className="text-xs text-center text-gray-400">
                {disabledBenefitIds.size} benefit{disabledBenefitIds.size !== 1 ? "s" : ""} removed — you can re-enable them from the dashboard anytime
              </p>
            )}
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {confirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Looks good — go to my Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
            >
              Skip review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
