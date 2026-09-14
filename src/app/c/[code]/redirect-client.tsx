"use client";

import { useEffect, useState } from "react";

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

  const initial = (storeName?.trim()?.[0] ?? "G").toUpperCase();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="animate-fade-up w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* Header brand tipis */}
        <div className="flex items-center justify-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-6 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white">
            R
          </span>
          <span className="text-xs font-semibold tracking-wide text-zinc-700">
            ReviewGate
            <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Terverifikasi
            </span>
          </span>
        </div>

        <div className="flex flex-col items-center px-6 py-8 text-center sm:px-8">
          {/* Avatar toko */}
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-md shadow-indigo-200">
              {initial}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-zinc-200">
              <span className="text-sm leading-none">⭐</span>
            </span>
          </div>

          <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900">
            {storeName}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Terima kasih sudah mampir! Kami alihkan ke Google Review…
          </p>

          {/* Progress / spinner */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" />
            <p className="text-sm font-medium text-zinc-600 tabular-nums">
              Membuka dalam {countdown > 0 ? countdown : 0} detik
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            />
          </div>

          <a
            href={url}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.99]"
          >
            Buka Google Review Sekarang
          </a>
          <p className="mt-3 text-xs text-zinc-400">
            Tidak otomatis terbuka? Klik tombol di atas.
          </p>
        </div>
      </div>
    </div>
  );
}
