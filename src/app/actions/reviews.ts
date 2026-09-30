"use server";

import { createClient } from "@/lib/supabase/server";
import { extractTopKeywords } from "@/lib/report-utils";

// Dipanggil dari rating-filter.tsx, Paket 3, saat bintang <3 dipilih
// (dipakai baik untuk "Lewati" -> comment null, maupun "Kirim" -> comment terisi)
export async function submitComplaint(
  cardId: string,
  rating: number,
  comment: string | null
) {
  const supabase = await createClient();
  const { error } = await supabase.from("complaints").insert({
    card_id: cardId,
    rating,
    comment: comment?.trim() || null,
  });

  if (error) return { error: error.message };
  return { error: null };
}

// Dipakai halaman Rekap - daftar toko Paket 3 milik admin yang sedang login
export async function getMyPaket3Cards() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu harus login dulu.", cards: [] };

  const { data } = await supabase
    .from("cards")
    .select("id,store_name")
    .eq("owner_id", user.id)
    .eq("package", "paket3");

  return { error: null, cards: data ?? [] };
}

// Ambil komplain dalam rentang tanggal untuk satu kartu, plus riwayat
// ringkasan periode yang masih ada (buat perbandingan periode 1 vs 2 dalam bulan berjalan)
export async function getRekapPeriode(
  cardId: string,
  periodStart: string,
  periodEnd: string
) {
  const supabase = await createClient();

  const { data: complaints } = await supabase
    .from("complaints")
    .select("id,rating,comment,created_at")
    .eq("card_id", cardId)
    .gte("created_at", periodStart)
    .lte("created_at", periodEnd)
    .order("created_at", { ascending: true });

  const { data: history } = await supabase
    .from("period_summaries")
    .select("*")
    .eq("card_id", cardId)
    .order("period_start", { ascending: true });

  return { complaints: complaints ?? [], history: history ?? [] };
}

// Simpan ringkasan periode 2-mingguan, lalu hapus data mentah periode itu
export async function exportDanResetPeriode(
  cardId: string,
  periodStart: string,
  periodEnd: string,
  complaints: { rating: number; comment: string | null }[]
) {
  const supabase = await createClient();

  const avgRating =
    complaints.length > 0
      ? complaints.reduce((sum, c) => sum + c.rating, 0) / complaints.length
      : null;

  const topKeywords = extractTopKeywords(complaints.map((c) => c.comment)).map(
    (k) => k.word
  );

  const { error: insertError } = await supabase.from("period_summaries").insert({
    card_id: cardId,
    period_start: periodStart,
    period_end: periodEnd,
    total_complaints: complaints.length,
    avg_rating: avgRating,
    top_keywords: topKeywords,
  });

  if (insertError) return { error: insertError.message };

  const { error: deleteError } = await supabase
    .from("complaints")
    .delete()
    .eq("card_id", cardId)
    .gte("created_at", periodStart)
    .lte("created_at", periodEnd);

  if (deleteError) return { error: deleteError.message };

  return { error: null, avgRating, topKeywords };
}

// Ambil ringkasan periode 2-mingguan milik BULAN BERJALAN saja untuk satu kartu
// (dipakai halaman Rekap Bulanan - hanya bulan yang belum "diselesaikan")
export async function getPeriodSummariesForCard(cardId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("period_summaries")
    .select("*")
    .eq("card_id", cardId)
    .order("period_start", { ascending: true });

  return data ?? [];
}

// Dipanggil setelah laporan bulanan di-export/print - hapus ringkasan
// 2-mingguan bulan itu secara permanen (tidak disimpan lintas bulan)
export async function deletePeriodSummaries(ids: string[]) {
  const supabase = await createClient();
  const { error } = await supabase.from("period_summaries").delete().in("id", ids);
  return { error: error?.message ?? null };
}
