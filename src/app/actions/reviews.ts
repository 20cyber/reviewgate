"use server";

import { createClient } from "@/lib/supabase/server";
import { extractTopKeywords } from "@/lib/report-utils";

// Dipanggil dari rating-filter.tsx, Paket 3, saat bintang <3 dipilih
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

// Dipakai dashboard Laporan Harian - ambil komplain hari ini yang belum
// dikirim, dikelompokkan per toko milik admin yang sedang login
export async function getTodayComplaintsGroupedByStore() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu harus login dulu.", groups: [] };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { data: myCards } = await supabase
    .from("cards")
    .select("id,store_name,owner_wa_number")
    .eq("owner_id", user.id)
    .eq("package", "paket3");

  if (!myCards || myCards.length === 0) return { error: null, groups: [] };

  const groups = [];
  for (const card of myCards) {
    const { data: complaints } = await supabase
      .from("complaints")
      .select("id,rating,comment,created_at")
      .eq("card_id", card.id)
      .eq("sent_in_daily_report", false)
      .gte("created_at", startOfToday.toISOString())
      .order("created_at", { ascending: true });

    if (complaints && complaints.length > 0) {
      groups.push({ card, complaints });
    }
  }
  return { error: null, groups };
}

// Tandai komplain sudah dikirim (dipanggil setelah admin klik tombol kirim)
export async function markComplaintsAsSent(complaintIds: string[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("complaints")
    .update({ sent_in_daily_report: true })
    .in("id", complaintIds);
  return { error: error?.message ?? null };
}

// Dipakai halaman Rekap 2 Mingguan - daftar toko Paket 3 milik admin
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
// ringkasan periode sebelumnya (buat perbandingan tren)
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

// Simpan ringkasan periode, lalu hapus data mentah periode itu
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
