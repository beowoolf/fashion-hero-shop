import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ListingPromotion, PromotionsFile } from "@/types/promotion";

const DATA_DIR = path.join(process.cwd(), ".data");
const PROMOTIONS_PATH = path.join(DATA_DIR, "promotions.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readPromotions(): Promise<ListingPromotion[]> {
  try {
    const raw = await readFile(PROMOTIONS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as PromotionsFile;
    if (!Array.isArray(parsed.promotions)) {
      return [];
    }
    return parsed.promotions;
  } catch {
    return [];
  }
}

export async function writePromotions(promotions: ListingPromotion[]): Promise<void> {
  await ensureDataDir();
  const payload: PromotionsFile = { promotions };
  await writeFile(PROMOTIONS_PATH, JSON.stringify(payload, null, 2), "utf-8");
}
