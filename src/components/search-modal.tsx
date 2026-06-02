"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CloseIcon, SearchIcon } from "./icons";
import { products } from "@/data/products";
import { mergeSearchResults } from "@/lib/promotions/merge-search-results";
import type { ListingPromotion } from "@/types/promotion";
import { SearchResultRow } from "./search-result-row";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activePromotions, setActivePromotions] = useState<ListingPromotion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    async function loadPromotions() {
      try {
        const res = await fetch("/api/promotions?status=active");
        if (!res.ok) return;
        const data = (await res.json()) as { promotions: ListingPromotion[] };
        if (!cancelled) setActivePromotions(data.promotions);
      } catch {
        // ignore — organic-only fallback
      }
    }
    loadPromotions();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const { promoted, organic } = useMemo(
    () => mergeSearchResults(products, activePromotions, query),
    [activePromotions, query],
  );

  const hasResults = promoted.length > 0 || organic.length > 0;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white shadow-lg w-full">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 border-b border-black/10 pb-3">
            <SearchIcon className="h-5 w-5 text-warm-gray flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj produktów…"
              className="flex-1 text-base text-charcoal placeholder:text-warm-gray outline-none bg-transparent"
            />
            <button
              onClick={handleClose}
              className="p-1 hover:opacity-60 transition-opacity"
              aria-label="Zamknij wyszukiwanie"
            >
              <CloseIcon />
            </button>
          </div>

          {query.trim() && (
            <div className="mt-4 max-h-[min(70vh,32rem)] overflow-y-auto">
              {!hasResults ? (
                <p className="text-sm text-warm-gray py-4">
                  Brak wyników dla „{query}”
                </p>
              ) : (
                <div className="space-y-4">
                  {promoted.length > 0 && (
                    <section aria-label="Promowane wyniki">
                      <h3 className="text-[10px] font-medium uppercase tracking-[0.8px] text-charcoal mb-2">
                        Promowane
                      </h3>
                      <div className="space-y-2">
                        {promoted.map((product) => (
                          <SearchResultRow
                            key={`promoted-${product.id}`}
                            product={product}
                            variant="promoted"
                            onNavigate={handleClose}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {promoted.length > 0 && organic.length > 0 && (
                    <div className="border-t border-charcoal/15 pt-4" role="separator" />
                  )}

                  {organic.length > 0 && (
                    <section aria-label="Wyniki organiczne">
                      {promoted.length > 0 && (
                        <h3 className="text-[10px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-2">
                          Pozostałe wyniki
                        </h3>
                      )}
                      <div className="space-y-2">
                        {organic.map((product) => (
                          <SearchResultRow
                            key={`organic-${product.id}`}
                            product={product}
                            variant="organic"
                            onNavigate={handleClose}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
