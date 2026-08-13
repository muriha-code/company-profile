/**
 * Converts a string into a clean, URL-friendly & Cloudinary-safe slug.
 *
 * Examples:
 * - "McKinsey & Company" -> "mckinsey-company"
 * - "FinTech Scaleup Financial Restructuring" -> "fintech-scaleup-financial-restructuring"
 * - "Financial Strategy" -> "financial-strategy"
 * - "hero-main" -> "hero-main"
 */
export function slugify(text: string): string {
  if (!text) return `item-${Date.now()}`;

  const slug = text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters & punctuation (e.g. &)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Replace multiple consecutive - with single -
    .replace(/^-+|-+$/g, ""); // Strip leading/trailing -

  return slug || `item-${Date.now()}`;
}
