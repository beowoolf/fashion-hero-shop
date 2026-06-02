"use client";

import Link from "next/link";
import { PromotionForm } from "@/components/seller/promotion-form";
import { useSeller } from "@/components/seller-provider";
import { getProductsBySellerId } from "@/data/products";

export default function NewPromotionPage() {
  const { seller } = useSeller();

  if (!seller) return null;

  const products = getProductsBySellerId(seller.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Strona główna
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/seller/promotions" className="hover:text-charcoal transition-colors">
          Promocje
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Nowa promocja</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2">Promuj produkt</h1>
      <p className="text-sm text-warm-gray mb-8">
        Wyróżnij ofertę w wynikach wyszukiwania na pozycjach 1–3 z etykietą „Promowane”.
      </p>

      {products.length === 0 ? (
        <p className="text-sm text-warm-gray">Brak produktów przypisanych do tego konta.</p>
      ) : (
        <PromotionForm sellerId={seller.id} products={products} />
      )}
    </div>
  );
}
