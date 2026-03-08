import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserCards, addUserCard } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

const DEMO_CARDS = ["amex-gold", "chase-sapphire-preferred", "chase-freedom-unlimited"];

// GET /api/cards/user — return the current user's active cards with full benefit data
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let cardIds = getUserCards(session.userId);

  // First time — seed with demo cards and persist them so future adds don't wipe them
  if (cardIds.length === 0) {
    for (const id of DEMO_CARDS) {
      addUserCard(session.userId, id);
    }
    cardIds = DEMO_CARDS;
  }

  const cards = cardIds.map((id) => CARD_CATALOG.find((c) => c.id === id)).filter(Boolean);

  return NextResponse.json({ cards });
}
