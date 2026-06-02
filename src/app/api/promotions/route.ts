import { NextResponse } from "next/server";
import {
  DuplicateActivePromotionError,
  InvalidPromotionRequestError,
  ProductNotOwnedError,
  PromotionSlotFullError,
} from "@/lib/promotions/errors";
import { createPromotion, listPromotions } from "@/lib/promotions/service";
import type { PromotionStatus } from "@/types/promotion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId") ?? undefined;
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "active" || statusParam === "expired"
      ? (statusParam as PromotionStatus)
      : undefined;

  const promotions = await listPromotions({ sellerId, status });
  return NextResponse.json({ promotions });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sellerId?: string;
      productId?: string;
      confirmPayment?: boolean;
    };

    const promotion = await createPromotion({
      sellerId: body.sellerId ?? "",
      productId: body.productId ?? "",
      confirmPayment: body.confirmPayment === true,
    });

    return NextResponse.json({ promotion }, { status: 201 });
  } catch (error) {
    if (error instanceof PromotionSlotFullError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof DuplicateActivePromotionError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof ProductNotOwnedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof InvalidPromotionRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Nie udało się utworzyć promocji" },
      { status: 500 },
    );
  }
}
