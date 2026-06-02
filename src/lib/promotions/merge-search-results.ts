import type { Product } from "@/types";
import type { ListingPromotion } from "@/types/promotion";
import { MAX_ACTIVE_PROMOTIONS } from "@/types/promotion";

const ORGANIC_RESULTS_LIMIT = 20;

function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return product.name.toLowerCase().includes(q);
}

export interface MergedSearchResults {
  promoted: Product[];
  organic: Product[];
}

export function mergeSearchResults(
  allProducts: Product[],
  activePromotions: ListingPromotion[],
  query: string,
): MergedSearchResults {
  const q = query.trim();
  if (!q) {
    return { promoted: [], organic: [] };
  }

  const activeProductIds = new Set(
    activePromotions
      .filter((p) => p.status === "active")
      .map((p) => p.productId),
  );

  const promoted: Product[] = [];
  for (const promotion of activePromotions) {
    if (promoted.length >= MAX_ACTIVE_PROMOTIONS) break;
    if (promotion.status !== "active") continue;
    const product = allProducts.find((p) => p.id === promotion.productId);
    if (product && matchesQuery(product, q)) {
      promoted.push(product);
    }
  }

  const promotedIds = new Set(promoted.map((p) => p.id));
  const organic = allProducts
    .filter(
      (p) =>
        matchesQuery(p, q) &&
        !promotedIds.has(p.id) &&
        !activeProductIds.has(p.id),
    )
    .slice(0, ORGANIC_RESULTS_LIMIT);

  return { promoted, organic };
}
