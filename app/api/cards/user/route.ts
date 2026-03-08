import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserCards } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

const DEMO_CARDS = ["amex-gold", "chase-sapphire-preferred", "chase-freedom-unlimited"];

// GET /api/cards/user — return the current user's active cards with full benefit data
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cardIds = getUserCards(session.userId);
  const ids = cardIds.length === 0 ? DEMO_CARDS : cardIds;
  const cards = ids.map((id) => CARD_CATALOG.find((c) => c.id === id)).filter(Boolean);

  return NextResponse.json({ cards });
}
