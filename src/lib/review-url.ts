/**
 * Normalisasi input Link Google Review.
 * - Kalau input sudah berupa URL lengkap (http...), simpan langsung.
 * - Kalau input mengandung placeid=XXX, ekstrak jadi
 *   https://search.google.com/local/writereview?placeid=XXX
 * - Kalau input terlihat seperti bare Place ID (tanpa spasi/slash,
 *   mis. ChIJ...), bungkus jadi URL writereview.
 */
export function normalizeReviewUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return raw;

  const placeIdParam = raw.match(/[?&]placeid=([^&#\s]+)/i);
  if (placeIdParam) {
    return `https://search.google.com/local/writereview?placeid=${placeIdParam[1]}`;
  }

  const looksLikeUrl = /^https?:\/\//i.test(raw);
  if (looksLikeUrl) return raw;

  const looksLikePlaceId = /^[A-Za-z0-9_-]{12,}$/.test(raw) && !raw.includes(" ");
  if (looksLikePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${raw}`;
  }

  // Google Maps share link tanpa skema (maps.app.goo.gl/..., goo.gl/maps/...)
  if (/^(maps\.app\.goo\.gl|goo\.gl|maps\.google\.)/i.test(raw)) {
    return `https://${raw}`;
  }

  return raw;
}
