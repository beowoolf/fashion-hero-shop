"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { PROMOTION_WEEKLY_FEE_PLN } from "@/types/promotion";

interface PromotionFormProps {
  sellerId: string;
  products: Product[];
}

export function PromotionForm({ sellerId, products }: PromotionFormProps) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selected = products.find((p) => p.id === productId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!productId) {
      setError("Wybierz produkt do promocji.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId,
          productId,
          confirmPayment: true,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Nie udało się utworzyć promocji.");
        return;
      }

      router.push("/seller/promotions");
      router.refresh();
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label
          htmlFor="product"
          className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
        >
          Wybierz produkt
        </label>
        <select
          id="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors bg-white"
          required
        >
          <option value="">— wybierz produkt —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.price} PLN
            </option>
          ))}
        </select>
      </div>

      <section className="bg-cream-light border border-border rounded px-5 py-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-3">
          Podsumowanie opłaty
        </h2>
        {selected ? (
          <dl className="space-y-2 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-warm-gray">Produkt</dt>
              <dd className="text-charcoal font-medium text-right">{selected.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-warm-gray">Okres</dt>
              <dd className="text-charcoal">7 dni</dd>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-border">
              <dt className="text-charcoal font-medium">Opłata</dt>
              <dd className="text-charcoal font-medium">
                {PROMOTION_WEEKLY_FEE_PLN} PLN / tydzień
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-warm-gray">
            Wybierz produkt, aby zobaczyć podsumowanie.
          </p>
        )}
      </section>

      {error && (
        <p className="text-red-600 text-[13px]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !productId}
        className="w-full sm:w-auto bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.8px] px-8 py-3 hover:bg-charcoal/90 transition-colors disabled:opacity-50"
      >
        {submitting ? "Przetwarzanie…" : "Opłać i promuj"}
      </button>
    </form>
  );
}
