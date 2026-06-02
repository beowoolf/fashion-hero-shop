import { SellerGuard } from "@/components/seller/seller-guard";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerGuard>{children}</SellerGuard>;
}
