/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a number to a currency format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
  }).format(amount);
}

/**
 * Calculate days remaining
 */
export function getDaysRemaining(endDate: Date | string): number {
  const end = new Date(endDate);
  const today = new Date();
  const diff = end.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/**
 * Calculate trending score
 */
export function calculateTrendingScore(
  responseCount: number,
  daysSinceCreation: number,
  engagement: number
): number {
  return (responseCount * engagement) / (daysSinceCreation + 1);
}

/**
 * Get trend type
 */
export function getTrendType(score: number): "hot" | "rising" | "falling" {
  if (score > 10) return "hot";
  if (score > 5) return "rising";
  return "falling";
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
