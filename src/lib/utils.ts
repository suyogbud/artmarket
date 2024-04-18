import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "NPR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "NPR", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  const formattedPrice = new Intl.NumberFormat("ne-NP", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NPR: "रू",
  };
  const currencySymbol = symbolMap[currency] || currency;
  return formattedPrice.replace(currency, currencySymbol);
}
