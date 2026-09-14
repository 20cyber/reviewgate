"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateCard } from "@/app/actions/cards";

export default function ActivateForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [storeName, setStoreName] = useState("");
  const [reviewInput, setReviewInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await activateCard(code, storeName, reviewInput);
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
