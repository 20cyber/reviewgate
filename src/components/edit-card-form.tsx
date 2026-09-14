"use client";

import { useState } from "react";
import { updateCard } from "@/app/actions/cards";
import type { Card } from "@/lib/types";

export default function EditCardForm({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);
  const [storeName, setStoreName] = useState(card.store_name ?? "");
  const [reviewInput, setReviewInput] = useState(card.google_review_url ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    const res = await updateCard(card.id, storeName, reviewInput);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setSaved(true);
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.97]"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.877.516l-3.5 1a1 1 0 01-1.207-1.207l1-3.5a2 2 0 01.516-.877l8.74-8.26z" />
        </svg>
        Edit
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="animate-fade-in mt-4 flex flex-col gap-2.5 rounded-xl bg-zinc-50 p-3.5 ring-1 ring-zinc-200/70"
    >
      <input
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        placeholder="Nama toko"
        className="rg-input rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
        required
      />
      <input
        value={reviewInput}
        onChange={(e) => setReviewInput(e.target.value)}
        placeholder="Link / Place ID"
        className="rg-input rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
        required
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      {saved && <p className="text-xs font-medium text-emerald-600">Tersimpan.</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Menyimpan…" : "Simpan"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-600 transition-all hover:bg-zinc-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
