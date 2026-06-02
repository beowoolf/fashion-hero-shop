"use client";

import Link from "next/link";
import type { Product } from "@/types";

function productGradient(hex: string): string {
  return `radial-gradient(ellipse at 50% 60%, ${hex}33 0%, ${hex}11 40%, #ece9e2 70%)`;
}

interface SearchResultRowProps {
  product: Product;
  variant: "promoted" | "organic";
  onNavigate: () => void;
}

export function SearchResultRow({
  product,
  variant,
  onNavigate,
}: SearchResultRowProps) {
  const color = product.colors[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onNavigate}
      className={
        variant === "promoted"
          ? "flex items-center gap-4 p-2 rounded bg-charcoal/[0.04] border border-charcoal/10 hover:bg-charcoal/[0.07] transition-colors"
          : "flex items-center gap-4 p-2 rounded hover:bg-cream transition-colors"
      }
    >
      <div
        className="w-14 h-14 flex-shrink-0 rounded flex items-center justify-center"
        style={{ background: productGradient(color.hex) }}
      >
        <div className="relative w-3/5 h-2/5">
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              background: `${color.hex}66`,
              transform: "rotate(-8deg) scaleX(1.4)",
            }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-[12px] font-medium uppercase tracking-[0.5px] truncate">
            {product.name}
          </h4>
          {variant === "promoted" && (
            <span className="text-[9px] font-medium uppercase tracking-wider bg-charcoal text-white px-1.5 py-0.5 flex-shrink-0">
              Promowane
            </span>
          )}
        </div>
        <p className="text-[12px] text-warm-gray">{color.name}</p>
      </div>
      <span className="text-[14px] font-medium">{product.price} zl</span>
    </Link>
  );
}
