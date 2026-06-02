"use client";

import Link from "next/link";
import { PromotionList } from "@/components/seller/promotion-list";
import { useSeller } from "@/components/seller-provider";

export default function SellerPromotionsPage() {
  const { seller, logout } = useSeller();

  if (!seller) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide flex flex-wrap items-center gap-x-1.5">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-charcoal">Promocje</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-charcoal">Promowane oferty</h1>
          <p className="text-sm text-warm-gray mt-1">
            Zalogowano jako <span className="text-charcoal">{seller.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/seller/promotions/new"
            className="inline-block bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.8px] px-5 py-2.5 hover:bg-charcoal/90 transition-colors"
          >
            Promuj produkt
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-[12px] text-warm-gray hover:text-charcoal underline"
          >
            Wyloguj
          </button>
        </div>
      </div>

      <PromotionList sellerId={seller.id} />
    </div>
  );
}
