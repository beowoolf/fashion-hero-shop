"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductById } from "@/data/products";
import type { ListingPromotion } from "@/types/promotion";

interface PromotionListProps {
  sellerId: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PromotionList({ sellerId }: PromotionListProps) {
  const [promotions, setPromotions] = useState<ListingPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/promotions?sellerId=${encodeURIComponent(sellerId)}`);
        if (!res.ok) throw new Error("Nie udało się pobrać promocji");
        const data = (await res.json()) as { promotions: ListingPromotion[] };
        if (!cancelled) setPromotions(data.promotions);
      } catch {
        if (!cancelled) setError("Nie udało się załadować listy promocji.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  if (loading) {
    return <p className="text-sm text-warm-gray py-4">Ładowanie promocji…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600 py-4">{error}</p>;
  }

  if (promotions.length === 0) {
    return (
      <p className="text-sm text-warm-gray py-4">
        Nie masz jeszcze żadnych promocji.{" "}
        <Link href="/seller/promotions/new" className="underline text-charcoal">
          Promuj pierwszy produkt
        </Link>
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border border-border rounded">
      {promotions.map((promotion) => {
        const product = getProductById(promotion.productId);
        const isActive = promotion.status === "active";
        return (
          <li key={promotion.id} className="px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-[14px] font-medium text-charcoal">
                {product?.name ?? `Produkt #${promotion.productId}`}
              </p>
              <p className="text-[12px] text-warm-gray mt-0.5">
                {promotion.weeklyFeePln} PLN / tydzień
              </p>
            </div>
            <span
              className={
                isActive
                  ? "text-[11px] uppercase tracking-wide text-green-800 bg-green-50 px-2 py-1 rounded self-start"
                  : "text-[11px] uppercase tracking-wide text-warm-gray bg-cream-light px-2 py-1 rounded self-start"
              }
            >
              {isActive
                ? `Aktywna do ${formatDate(promotion.endsAt)}`
                : "Wygasła"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
