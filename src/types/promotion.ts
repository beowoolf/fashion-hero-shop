export const PROMOTION_WEEKLY_FEE_PLN = 49;
export const PROMOTION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_ACTIVE_PROMOTIONS = 3;

export type PromotionStatus = "active" | "expired";

export interface ListingPromotion {
  id: string;
  productId: string;
  sellerId: string;
  status: PromotionStatus;
  weeklyFeePln: typeof PROMOTION_WEEKLY_FEE_PLN;
  createdAt: string;
  startsAt: string;
  endsAt: string;
}

export interface PromotionsFile {
  promotions: ListingPromotion[];
}
