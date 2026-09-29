"use client";

import { useEffect, useState } from "react";
import {
  getMyPaket3Cards,
  getRekapPeriode,
  exportDanResetPeriode,
} from "@/app/actions/reviews";
import { extractTopKeywords } from "@/lib/report-utils";

function getRentangPeriodeSaatIni() {
  const now = new Date();
  const tanggal = now.getDate();
  const start = new Date(now.getFullYear(), now.getMonth(), tanggal <= 15 ? 1 : 16);
  const end =
    tanggal <= 15
      ? new Date(now.getFullYear(), now.getMonth(), 15, 23, 59, 59)
      : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

export default function RekapDuaMingguanPage() {
  const [cards, setCards] = useState<{ id: string; store_name: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { start, end } = getRentangPeriodeSaatIni();

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
    getRekapPeriode(selectedCardId, start.toISOString(), end.toISOString()).then(
      ({ complaints, history }) => {
        setComplaints(complaints);
        setHistory(history);
        setLoading(false);
      }
    );
  }, [selectedCardId]);

  const avgRating =
    complaints.length > 0
      ? (complaints.reduce((s, c) => s + c.rating, 0) / complaints.length).toFixed(2)
      : "-";
  const topKeywords = extractTopKeywords(complaints.map((c) => c.comment));

  const periodeSebelumnya = history[history.length - 1];
  let trenTeks = "Belum ada data periode sebelumnya untuk dibandingkan.";
  if (periodeSebelumnya && complaints.length > 0) {
    const selisih = Number(avgRating) - Number(periodeSebelumnya.avg_rating || 0);
    if (selisih > 0.1) trenTeks = `Rating naik ${selisih.toFixed(2)} poin dibanding periode sebelumnya. 📈`;
    else if (selisih < -0.1) trenTeks = `Rating turun ${Math.abs(selisih).toFixed(2)} poin dibanding periode sebelumnya. 📉`;
    else trenTeks = "Rating relatif stabil dibanding periode sebelumnya.";
  }

  async function handleExport() {
    if (!confirm("Setelah export, data pengaduan periode ini akan DIHAPUS. Lanjutkan?")) return;
    await exportDanResetPeriode(selectedCardId, start.toISOString(), end.toISOString(), complaints);
    window.print();
    setComplaints([]);
  }

  if (loading && cards.length === 0) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-sm text-zinc-500">Memuat...</p>;
  }

  if (cards.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Rekap 2 Mingguan</h1>
        <p className="mt-4 rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
          Belum ada toko dengan Paket 3.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Rekap 2 Mingguan</h1>

      <select
        value={selectedCardId}
        onChange={(e) => setSelectedCardId(e.target.value)}
        className="mt-4 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900"
      >
        {cards.map((c) => (
          <option key={c.id} value={c.id}>{c.store_name}</option>
        ))}
      </select>

      <p className="mt-3 text-sm text-zinc-500">
        Periode: {start.toLocaleDateString("id-ID")} - {end.toLocaleDateString("id-ID")}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Rata-rata rating</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{avgRating}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Total pengaduan</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{complaints.length}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-[13px] font-semibold text-zinc-900">Prediksi & Tren</p>
        <p className="mt-1.5 text-sm text-zinc-600">{trenTeks}</p>
        {topKeywords.length > 0 && (
          <>
            <p className="mt-3 text-xs text-zinc-500">Komplain yang paling sering muncul:</p>
            <ul className="mt-1 flex flex-col gap-0.5 text-sm text-zinc-700">
              {topKeywords.map((k) => (
                <li key={k.word}>{k.word} ({k.count}x)</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        onClick={handleExport}
        disabled={complaints.length === 0}
        className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Export PDF & Reset Data Periode Ini
      </button>
    </main>
  );
}
