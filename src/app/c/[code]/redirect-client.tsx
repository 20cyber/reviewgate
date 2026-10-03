"use client";

import { useEffect, useState } from "react";
import MapScreen from "./map-background";

export default function AutoRedirect({ url, storeName }: { url: string; storeName: string }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = url;
    }, 3000);
    return () => clearTimeout(t);
  }, [url]);

  useEffect(() => {
    if (countdown <= 0) return;
    const i = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(i);
  }, [countdown]);

  const initials =
    storeName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "G";

  return (
    <MapScreen>
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white px-7 py-9 text-center shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200">
        {/* Avatar toko */}
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-700 text-lg font-bold text-white">
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-zinc-200">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-amber-400" aria-hidden="true">
              <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
            </svg>
          </span>
        </div>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900">
          {storeName}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Terima kasih sudah mampir! Kami alihkan ke Google Review…
        </p>

        {/* Hitung mundur */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-700" />
          <p className="text-sm font-medium tabular-nums text-zinc-600">
            Membuka dalam {countdown > 0 ? countdown : 0} detik
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-indigo-700 transition-all duration-1000"
            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
          />
        </div>

        <a
          href={url}
          className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-800 active:scale-[0.99]"
        >
          Buka Google Review Sekarang
        </a>
        <p className="mt-3 text-xs text-zinc-400">
          Tidak otomatis terbuka? Klik tombol di atas.
        </p>
      </div>
    </MapScreen>
  );
}