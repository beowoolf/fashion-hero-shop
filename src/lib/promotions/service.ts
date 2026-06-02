import { randomUUID } from "crypto";
import { getProductById } from "@/data/products";
import {
  MAX_ACTIVE_PROMOTIONS,
  PROMOTION_DURATION_MS,
  PROMOTION_WEEKLY_FEE_PLN,
  type ListingPromotion,
  type PromotionStatus,
} from "@/types/promotion";
import {
  DuplicateActivePromotionError,
  InvalidPromotionRequestError,
  ProductNotOwnedError,
  PromotionSlotFullError,
} from "./errors";
import { readPromotions, writePromotions } from "./store";

export function expireStale(promotions: ListingPromotion[]): ListingPromotion[] {
  const now = Date.now();
  return promotions.map((p) => {
    if (p.status === "active" && new Date(p.endsAt).getTime() <= now) {
      return { ...p, status: "expired" as PromotionStatus };
    }
    return p;
  });
}

async function loadAndExpire(): Promise<ListingPromotion[]> {
  const raw = await readPromotions();
  const expired = expireStale(raw);
  const changed = expired.some((p, i) => p.status !== raw[i]?.status);
  if (changed) {
    await writePromotions(expired);
  }
  return expired;
}

export function countActive(promotions: ListingPromotion[]): number {
  return promotions.filter((p) => p.status === "active").length;
}

export interface ListPromotionsOptions {
  sellerId?: string;
  status?: PromotionStatus;
}

export async function listPromotions(
  options: ListPromotionsOptions = {},
): Promise<ListingPromotion[]> {
  let result = await loadAndExpire();

  if (options.sellerId) {
    result = result.filter((p) => p.sellerId === options.sellerId);
  }
  if (options.status) {
    result = result.filter((p) => p.status === options.status);
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export interface CreatePromotionInput {
  sellerId: string;
  productId: string;
  confirmPayment: boolean;
}

export async function createPromotion(
  input: CreatePromotionInput,
): Promise<ListingPromotion> {
  if (!input.confirmPayment) {
    throw new InvalidPromotionRequestError("Potwierdź płatność, aby aktywować promocję");
  }
  if (!input.sellerId?.trim() || !input.productId?.trim()) {
    throw new InvalidPromotionRequestError("Brak wymaganych pól");
  }

  const product = getProductById(input.productId);
  if (!product) {
    throw new InvalidPromotionRequestError("Nie znaleziono produktu");
  }
  if (product.sellerId !== input.sellerId) {
    throw new ProductNotOwnedError();
  }

  const promotions = await loadAndExpire();

  if (countActive(promotions) >= MAX_ACTIVE_PROMOTIONS) {
    throw new PromotionSlotFullError();
  }

  const duplicate = promotions.some(
    (p) => p.productId === input.productId && p.status === "active",
  );
  if (duplicate) {
    throw new DuplicateActivePromotionError();
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + PROMOTION_DURATION_MS);

  const promotion: ListingPromotion = {
    id: randomUUID(),
    productId: input.productId,
    sellerId: input.sellerId,
    status: "active",
    weeklyFeePln: PROMOTION_WEEKLY_FEE_PLN,
    createdAt: now.toISOString(),
    startsAt: now.toISOString(),
    endsAt: endsAt.toISOString(),
  };

  await writePromotions([promotion, ...promotions]);
  return promotion;
}
