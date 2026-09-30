"use client";

import { useEffect, useState } from "react";
import {
  getMyPaket3Cards,
  getPeriodSummariesForCard,
  deletePeriodSummaries,
} from "@/app/actions/reviews";
import { mergeKeywordArrays } from "@/lib/report-utils";

type Summary = {
  id: string;
  period_start: string;
  period_end: string;
  total_complaints: number;
  avg_rating: number | null;
  top_keywords: string[] | null;
};

function bulanLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export default function RekapBulananPage() {
  const [cards, setCards] = useState<{ id: string; store_name: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPaket3Cards().then((res) => {
      setCards(res.cards);
      if (res.cards.length > 0) setSelectedCardId(res.cards[0].id);
      else setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCardId) return;
    setLoading(true);
    getPeriodSummariesForCard(selectedCardId).then((data) => {
      // Karena ringkasan yang tersisa cuma milik bulan berjalan (bulan
      // sebelumnya sudah dihapus tiap kali diselesaikan), cukup ambil semua.
      setSummaries(data as Summary[]);
      setLoading(false);
    });
  }, [selectedCardId]);

  if (loading && cards.length === 0) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-sm text-zinc-500">Memuat...</p>;
  }

  if (cards.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Rekap Bulanan</h1>
        <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
          Belum ada toko dengan Paket 3.
        </p>
      </main>
    );
  }

  const totalComplaints = summaries.reduce((s, i) => s + i.total_complaints, 0);
  const avgRating =
    totalComplaints > 0
      ? summaries.reduce((s, i) => s + (i.avg_rating ?? 0) * i.total_complaints, 0) / totalComplaints
      : null;
  const topKeywords = mergeKeywordArrays(summaries.map((s) => s.top_keywords));

  const [periode1, periode2] = summaries;
  let progresTeks = "Belum ada rekap 2-mingguan bulan ini.";
  if (summaries.length === 1) {
    progresTeks = "Baru 1 dari 2 rekap 2-mingguan bulan ini — progres lengkap muncul setelah periode kedua di-export.";
  } else if (summaries.length === 2 && periode1.avg_rating !== null && periode2.avg_rating !== null) {
    const selisih = periode2.avg_rating - periode1.avg_rating;
    if (selisih > 0.1) progresTeks = `Rating naik ${selisih.toFixed(2)} poin dari periode 1 ke periode 2 bulan ini. 📈`;
    else if (selisih < -0.1) progresTeks = `Rating turun ${Math.abs(selisih).toFixed(2)} poin dari periode 1 ke periode 2 bulan ini. 📉`;
    else progresTeks = "Rating relatif stabil antara periode 1 dan periode 2 bulan ini.";
  }

  async function handleSelesaikanBulan() {
    if (!confirm("Setelah ini, SEMUA data rekap bulan ini akan dihapus permanen. Lanjutkan?")) return;
    window.print();
    await deletePeriodSummaries(summaries.map((s) => s.id));
    setSummaries([]);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Rekap Bulanan</h1>

      <select
        value={selectedCardId}
        onChange={(e) => setSelectedCardId(e.target.value)}
        className="mt-4 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
      >
        {cards.map((c) => (
          <option key={c.id} value={c.id}>{c.store_name}</option>
        ))}
      </select>

      {summaries.length === 0 ? (
        <p className="mt-6 rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
          Belum ada rekap 2-mingguan yang di-export bulan ini.
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-zinc-500">
            Bulan: <b>{bulanLabel(summaries[0].period_start)}</b> · {summaries.length} dari 2 periode
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs text-zinc-500">Rata-rata rating</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {avgRating !== null ? avgRating.toFixed(2) : "-"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-xs text-zinc-500">Total pengaduan</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{totalComplaints}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-[13px] font-semibold text-zinc-900">Progres Dalam Bulan Ini</p>
            <p className="mt-1.5 text-sm text-zinc-600">{progresTeks}</p>
            {topKeywords.length > 0 && (
              <>
                <p className="mt-3 text-xs text-zinc-500">Komplain yang paling sering muncul:</p>
                <ul className="mt-1 flex flex-col gap-0.5 text-sm text-zinc-700">
                  {topKeywords.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <button
            onClick={handleSelesaikanBulan}
            disabled={summaries.length < 2}
            className="mt-5 w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export PDF & Selesaikan Bulan Ini
          </button>
          {summaries.length < 2 && (
            <p className="mt-2 text-center text-xs text-zinc-400">
              Tombol aktif setelah kedua periode 2-mingguan bulan ini di-export.
            </p>
          )}
        </>
      )}
    </main>
  );
}
