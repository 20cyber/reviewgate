"use client";

import { useState, useTransition } from "react";
import { resetCard } from "@/app/actions/reset-card";

export function ResetCardButton({
  code,
  storeName,
}: {
  code: string;
  storeName?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const run = () =>
    start(async () => {
      const res = await resetCard(code);
      if (res.ok) {
        setOpen(false);
        setError("");
      } else {
        setError(res.message || "Gagal reset");
      }
    });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        Reset Kartu
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Reset kartu {code}?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Kartu{storeName ? ` milik ${storeName}` : ""} akan kembali belum
              aktif. Data toko, statistik scan, komplain, dan rekap kartu ini
              ikut dihapus permanen. QR dan NFC tetap bisa diaktivasi ulang.
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm">
                Batal
              </button>
              <button
                onClick={run}
                disabled={pending}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
              >
                {pending ? "Mereset..." : "Ya, reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}