"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSeller } from "@/components/seller-provider";

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const { seller, isReady } = useSeller();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginRoute = pathname === "/seller/login";

  useEffect(() => {
    if (!isReady) return;
    if (!seller && !isLoginRoute) {
      router.replace("/seller/login");
    }
    if (seller && isLoginRoute) {
      router.replace("/seller/promotions");
    }
  }, [isReady, seller, isLoginRoute, router]);

  if (!isReady) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-sm text-warm-gray">
        Ładowanie…
      </div>
    );
  }

  if (!seller && !isLoginRoute) {
    return null;
  }

  if (seller && isLoginRoute) {
    return null;
  }

  return <>{children}</>;
}
