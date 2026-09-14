"use client";

// src/components/my-card-item.tsx

import { useState, useTransition } from "react";
import { updateCard } from "@/app/actions/cards";

type Card = {
  id: string;
  unique_code: string;
  status: "inactive" | "active";
  store_name: string | null;
  google_review_url: string | null;
  activated_at: string | null;
};

export default function MyCardItem({ card }: { card: Card }) {
  const [storeName, setStoreName] = useState(card.store_name ?? "");
  const [reviewUrl, setReviewUrl] = useState(card.google_review_url ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    setMessage(null);
    startTransition(async () => {
      const res = await updateCard(card.id, storeName, reviewUrl);
      setMessage(res.error ?? "Tersimpan — kartu ini sekarang mengarah ke toko yang baru diisi.");
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <code className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-sm font-semibold text-zinc-800">
          {card.unique_code}
        </code>
        <span
          className={
            "rounded-full px-2.5 py-0.5 text-xs font-medium " +
            (card.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-zinc-100 text-zinc-500")
          }
        >
          {card.status === "active" ? "Aktif" : "Belum aktif"}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-600">
          Nama toko
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Contoh: Kaktus Coffee Place"
          />
        </label>
        <label className="text-xs font-medium text-zinc-600">
          Link Google Review
          <input
            type="url"
            value={reviewUrl}
            onChange={(e) => setReviewUrl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            placeholder="https://g.page/r/..."
          />
        </label>
      </div>

      {message && <p className="mt-2 text-xs text-zinc-600">{message}</p>}

      <div className="mt-3">
        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Simpan / Ganti Toko Tujuan
        </button>
      </div>
    </div>
  );
}
