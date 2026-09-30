function normalizeWaNumber(nomor: string) {
  const bersih = nomor.replace(/[^0-9]/g, "");
  return bersih.startsWith("0") ? "62" + bersih.slice(1) : bersih;
}

// Dipakai Paket 2: bintang 1-2 langsung buka WA dengan pesan template,
// tanpa menyimpan data apa pun ke database
export function buildDirectWaComplaintLink(
  storeName: string,
  waNumber: string,
  rating: number
) {
  const pesan = `Halo, saya baru saja mengunjungi ${storeName} dan ingin menyampaikan keluhan (rating saya: ${rating} bintang). Keluhan saya: `;
  return `https://wa.me/${normalizeWaNumber(waNumber)}?text=${encodeURIComponent(pesan)}`;
}

// Dipakai Paket 3: bintang 1-2, komentar yang diketik pelanggan langsung
// jadi isi pesan WA ke owner (real-time, sekaligus data tersimpan terpisah)
export function buildDirectWaComplaintLinkWithComment(
  storeName: string,
  waNumber: string,
  rating: number,
  comment: string
) {
  const pesan = `Halo, saya baru saja mengunjungi ${storeName} (rating saya: ${rating} bintang). ${comment}`;
  return `https://wa.me/${normalizeWaNumber(waNumber)}?text=${encodeURIComponent(pesan)}`;
}

// Heuristik sederhana: hitung kata yang paling sering muncul di komentar,
// setelah membuang kata-kata umum bahasa Indonesia
const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "untuk", "ini", "itu", "saya", "kami",
  "juga", "dengan", "ada", "tidak", "sangat", "sekali", "banget", "jadi",
  "saja", "pada", "karena", "atau", "lebih", "masih", "sudah", "belum",
  "aja", "nya", "kurang", "agak", "terlalu", "harus", "bisa",
]);

export function extractTopKeywords(comments: (string | null)[], limit = 5) {
  const freq: Record<string, number> = {};
  for (const comment of comments) {
    if (!comment) continue;
    const words = comment
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w));
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

// Gabungkan kata kunci dari beberapa ringkasan periode (dipakai rekap bulanan)
export function mergeKeywordArrays(arrays: (string[] | null)[], limit = 5) {
  const freq: Record<string, number> = {};
  for (const arr of arrays) {
    if (!arr) continue;
    for (const word of arr) freq[word] = (freq[word] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}
