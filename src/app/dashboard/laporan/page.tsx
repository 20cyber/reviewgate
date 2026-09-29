"use client";

import { useEffect, useState } from "react";
import {
  getTodayComplaintsGroupedByStore,
  markComplaintsAsSent,
} from "@/app/actions/reviews";
import { buildDailyReportWaLink } from "@/lib/report-utils";

export default function LaporanHarianPage() {
  const [groups, setGroups] = useState<
    { card: { id: string; store_name: string; owner_wa_number: string | null }; complaints: any[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodayComplaintsGroupedByStore().then((res) => {
      setGroups(res.groups as any);
      setLoading(false);
    });
  }, []);

  async function handleKirim(
    cardId: string,
    storeName: string,
    waNumber: string | null,
    complaints: any[]
  ) {
    if (!waNumber) {
      alert(`Nomor WA owner ${storeName} belum diisi. Lengkapi dulu di halaman edit toko.`);
      return;
    }
    const link = buildDailyReportWaLink(storeName, waNumber, complaints);
    window.open(link, "_blank");
    await markComplaintsAsSent(complaints.map((c) => c.id));
    setGroups((prev) => prev.filter((g) => g.card.id !== cardId));
  }

  if (loading) {
    return <p className="mx-auto max-w-2xl px-4 py-10 text-sm text-zinc-500">Memuat data hari ini...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Laporan Harian</h1>
      <p className="mt-1.5 text-sm text-zinc-500">
        Klik "Kirim ke WA" untuk tiap toko di bawah ini. Tombol akan membuka
        tab baru langsung ke chat WhatsApp owner dengan pesan yang sudah
        tersusun otomatis — tinggal tekan kirim di WhatsApp.
      </p>

      {groups.length === 0 && (
        <p className="mt-8 rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 ring-1 ring-zinc-100">
          Tidak ada pengaduan baru hari ini yang perlu dikirim. 🎉
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {groups.map(({ card, complaints }) => (
          <div
            key={card.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-900">{card.store_name}</h2>
                <p className="text-xs text-zinc-500">{complaints.length} pengaduan hari ini</p>
              </div>
              <button
                onClick={() => handleKirim(card.id, card.store_name, card.owner_wa_number, complaints)}
                className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.99]"
              >
                Kirim ke WA
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-1.5 text-[13px] text-zinc-600">
              {complaints.map((c) => (
                <li key={c.id}>
                  ⭐ {c.rating} {c.comment ? `- "${c.comment}"` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
