"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <main className="animate-fade-in">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-10 text-center sm:px-6 sm:pt-20 sm:pb-16">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          QR + NFC dalam satu kartu fisik
        </div>

        <h1 className="animate-fade-up stagger-1 mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.1]">
          Tap kartu,
          <br className="sm:hidden" /> langsung ke{" "}
          <span className="text-indigo-600">Google Review</span>
        </h1>
        <p className="animate-fade-up stagger-2 mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg">
          ReviewGate menghubungkan kartu fisik toko kamu ke halaman ulasan
          Google. Aktivasi sekali — setiap scan & tap berikutnya otomatis
          mengarah ke review.
        </p>

        <div className="animate-fade-up stagger-3 mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link
            href="/dashboard"
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.99] sm:w-auto"
          >
            Mulai Aktivasi Kartu →
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 active:scale-[0.99] sm:w-auto"
          >
            Saya sudah punya kartu
          </Link>
        </div>

        {/* Cek kode */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) router.push(`/c/${encodeURIComponent(code.trim())}`);
          }}
          className="animate-fade-up stagger-4 mx-auto mt-8 flex max-w-md gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Cek kode kartu, mis. RG-ABC123"
            className="rg-input min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
          >
            Cek
          </button>
        </form>
        <p className="mt-3 text-xs text-zinc-400">
          Punya kartu fisik? Scan QR / tap NFC — atau cek manual kodenya di atas.
        </p>
      </section>

      {/* CARA KERJA */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            {
              icon: "📲",
              title: "Pelanggan scan / tap",
              desc: "QR atau NFC di kartu membuka halaman /c/[kode] yang unik per kartu.",
            },
            {
              icon: "⚙️",
              title: "Pemilik aktivasi sekali",
              desc: "Login & isi nama toko + link Google Review. Tersimpan permanen.",
            },
            {
              icon: "⭐",
              title: "Auto ke Google Review",
              desc: "Setiap kunjungan berikutnya langsung diarahkan — tanpa login.",
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className="animate-fade-up rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              style={{ animationDelay: `${0.08 * i}s` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg ring-1 ring-indigo-100">
                {s.icon}
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                Langkah {i + 1}
              </p>
              <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-zinc-900">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KEUNGGULAN + CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="grid sm:grid-cols-2">
            <div className="p-7 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                Kenapa ReviewGate?
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
                Dibuat untuk pemilik toko yang sibuk.
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  ["Satu kode untuk QR & NFC", "Tidak perlu cetak ulang tiap ganti link."],
                  ["Ganti link kapan pun", "Pindah lokasi Google Maps? Update dari dashboard."],
                  ["Tanpa aplikasi tambahan", "Berjalan di browser HP pelanggan."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                      ✓
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-900">{t}</span>
                      <span className="block text-sm text-zinc-500">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center bg-zinc-900 p-7 text-white sm:p-10">
              <p className="text-sm font-medium text-zinc-300">
                Contoh alur nyata
              </p>
              <div className="mt-3 space-y-2 font-mono text-[13px]">
                <div className="rounded-xl bg-white/10 px-4 py-2.5 ring-1 ring-white/10">
                  🔗 reviewgate.id/c/RG-ABC123
                </div>
                <div className="flex items-center gap-2 px-1 text-zinc-400">
                  <span>↓</span>
                  <span className="font-sans text-xs">belum aktif → form aktivasi pemilik</span>
                </div>
                <div className="rounded-xl bg-indigo-600 px-4 py-2.5 ring-1 ring-indigo-400">
                  ⭐ google.com/maps/.../writereview
                </div>
                <div className="flex items-center gap-2 px-1 text-zinc-400">
                  <span>↓</span>
                  <span className="font-sans text-xs">sudah aktif → auto-redirect 3 detik</span>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.99]"
              >
                Daftar gratis sebagai pemilik toko
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
