import type { OfferKind } from "@/lib/types";

/** Only combo + family get special badges; everything else is «عرض». */
const LABELS: Record<OfferKind, string> = {
  combo: "كومبو",
  family: "عائلي",
  deal: "عرض",
};

export function offerBadgeLabel(
  offerKind: OfferKind | null | undefined,
  fallbackIsOffer = false,
): string | null {
  if (offerKind && LABELS[offerKind]) return LABELS[offerKind];
  if (fallbackIsOffer) return "عرض";
  return null;
}
