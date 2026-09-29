"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateCard } from "@/app/actions/cards";

const PAKET_LIST = [
  {
    id: "paket1" as const,
    nama: "Paket 1",
    tagline: "Gratis",
    deskripsi: "Langsung ke Google Review, tanpa filter.",
  },
  {
    id: "paket2" as const,
    nama: "Paket 2",
    tagline: "Filter Bintang",
    deskripsi: "Bintang <3 diarahkan ke WA owner. Tanpa laporan.",
  },
  {
    id: "paket3" as const,
    nama: "Paket 3",
    tagline: "Filter + Laporan",
    deskripsi: "Filter bintang + laporan harian & rekap 2 mingguan.",
  },
];

export default function ActivateForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [storeName, setStoreName] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [packageType, setPackageType] = useState<"paket1" | "paket2" | "paket3">("paket1");
  const [waNumber, setWaNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const butuhWa = packageType === "paket2" || packageType === "paket3";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await activateCard(code, storeName, reviewInput, packageType, waNumber);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <h2 className="text-[15px] font-semibold tracking-tight text-zinc-900">
        Form aktivasi kartu
      </h2>
      <p className="mt-0.5 text-[13px] text-zinc-500">
        Isi sekali — kartu langsung terhubung permanen.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
            Kode kartu
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="mis. RG-ABC123"
            className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 font-mono text-sm text-zinc-900 placeholder:text-zinc-400"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
            Nama toko / bisnis
          </label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="mis. Kopi Barokah"
            className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
            Link Google Review / Place ID
          </label>
          <input
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
            placeholder="https://… atau ChIJxxxx"
            className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
            required
          />
          <p className="mt-1.5 rounded-lg bg-indigo-50/70 px-3 py-2 text-xs leading-relaxed text-indigo-700 ring-1 ring-indigo-100">
            💡 Bisa tempel link share Google Maps, link writereview lengkap,
            atau Place ID — otomatis dinormalisasi.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
            Pilih paket
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {PAKET_LIST.map((p) => {
              const aktif = packageType === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPackageType(p.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    aktif
                      ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <p className={`text-[13px] font-semibold ${aktif ? "text-indigo-700" : "text-zinc-900"}`}>
                    {p.nama}
                  </p>
                  <p className={`text-[11px] font-medium ${aktif ? "text-indigo-500" : "text-zinc-400"}`}>
                    {p.tagline}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-zinc-500">
                    {p.deskripsi}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {butuhWa && (
          <div className="animate-fade-in">
            <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
              Nomor WA owner toko
            </label>
            <input
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="mis. 08123456789"
              className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              required={butuhWa}
            />
            <p className="mt-1.5 text-[11px] text-zinc-400">
              Dipakai untuk mengirim pengaduan pelanggan yang memberi rating rendah.
            </p>
          </div>
        )}

        {error && (
          <p className="animate-fade-in rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Mengaktifkan…" : "Aktifkan Kartu →"}
        </button>
      </div>
    </form>
  );
}
