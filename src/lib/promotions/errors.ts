export class PromotionSlotFullError extends Error {
  constructor() {
    super("Wszystkie sloty promowane są zajęte");
    this.name = "PromotionSlotFullError";
  }
}

export class ProductNotOwnedError extends Error {
  constructor() {
    super("Ten produkt nie należy do Twojego konta sprzedawcy");
    this.name = "ProductNotOwnedError";
  }
}

export class DuplicateActivePromotionError extends Error {
  constructor() {
    super("Ten produkt jest już promowany");
    this.name = "DuplicateActivePromotionError";
  }
}

export class InvalidPromotionRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPromotionRequestError";
  }
}
