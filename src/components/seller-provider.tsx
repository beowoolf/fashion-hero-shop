"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Seller } from "@/types/seller";
import { getSellerById } from "@/data/sellers";

interface SellerContextValue {
  seller: Seller | null;
  loginAsSeller: (sellerId: string) => void;
  logout: () => void;
  isReady: boolean;
}

const SellerContext = createContext<SellerContextValue | null>(null);

const STORAGE_KEY = "fashionhero_seller";

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const found = getSellerById(stored);
          if (found) setSeller(found);
        }
      } catch {
        // ignore
      }
      setIsReady(true);
    });
  }, []);

  const loginAsSeller = useCallback((sellerId: string) => {
    const found = getSellerById(sellerId);
    if (!found) return;
    localStorage.setItem(STORAGE_KEY, sellerId);
    setSeller(found);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSeller(null);
  }, []);

  return (
    <SellerContext.Provider value={{ seller, loginAsSeller, logout, isReady }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) {
    throw new Error("useSeller must be used within SellerProvider");
  }
  return ctx;
}
