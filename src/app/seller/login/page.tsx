"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAllSellers } from "@/data/sellers";
import { useSeller } from "@/components/seller-provider";

export default function SellerLoginPage() {
  const { loginAsSeller } = useSeller();
  const router = useRouter();
  const [sellerId, setSellerId] = useState("");
  const sellers = getAllSellers();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sellerId) return;
    loginAsSeller(sellerId);
    router.push("/seller/promotions");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Strona główna
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Panel sprzedawcy</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2 text-center">
        Panel sprzedawcy
      </h1>
      <p className="text-sm text-warm-gray text-center mb-8">
        Wybierz konto sprzedawcy (demo)
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="seller"
            className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5"
          >
            Sprzedawca
          </label>
          <select
            id="seller"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors bg-white"
            required
          >
            <option value="">— wybierz —</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-charcoal text-white text-[12px] font-medium uppercase tracking-[0.8px] py-3 hover:bg-charcoal/90 transition-colors"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
}
