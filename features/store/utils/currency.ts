/**
 * Format price as Sri Lankan Rupees (LKR)
 * @param price - The price to format
 * @returns Formatted price string with LKR symbol
 */
export function formatPrice(price: number): string {
  return `LKR ${price.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format price range for display
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(min: number, max: number): string {
  return `LKR ${min.toLocaleString("en-LK")} - LKR ${max.toLocaleString(
    "en-LK"
  )}`;
}
