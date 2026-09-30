"use client";

import { useState } from "react";
import { submitComplaint } from "@/app/actions/reviews";
import {
  buildDirectWaComplaintLink,
  buildDirectWaComplaintLinkWithComment,
} from "@/lib/report-utils";
import AutoRedirect from "./redirect-client";

type Props = {
  cardId: string;
  storeName: string;
  googleReviewUrl: string;
  ownerWaNumber: string | null;
  packageType: "paket2" | "paket3";
};

export default function RatingFilter({
  cardId,
  storeName,
  googleReviewUrl,
  ownerWaNumber,
  packageType,
}: Props) {
  const [step, setStep] = useState<"pilih" | "komentar" | "selesai" | "redirect">("pilih");
  const [ratingDipilih, setRatingDipilih] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function bukaWaTemplateAtauSelesai(rating: number) {
    if (ownerWaNumber) {
      window.location.href = buildDirectWaComplaintLink(storeName, ownerWaNumber, rating);
    } else {
      setStep("selesai");
    }
  }

  function handlePilihBintang(rating: number) {
    setRatingDipilih(rating);

    if (rating >= 3) {
      setStep("redirect");
      return;
    }

    if (packageType === "paket2") {
      bukaWaTemplateAtauSelesai(rating);
      return;
    }

    // Paket 3 -> tampilkan kolom komentar (boleh isi, boleh lewati)
    setStep("komentar");
  }

  // Paket 3, tombol "Lewati": tetap simpan rating, tetap buka WA (pesan template umum)
  async function handleLewati() {
    if (!ratingDipilih) return;
    setLoading(true);
    await submitComplaint(cardId, ratingDipilih, null);
    setLoading(false);
    bukaWaTemplateAtauSelesai(ratingDipilih);
  }

  // Paket 3, tombol "Kirim": simpan rating+komentar, buka WA dengan isi komentar itu
  async function handleKirimKomentar() {
    if (!ratingDipilih || comment.trim().length === 0) return;
    setLoading(true);
    await submitComplaint(cardId, ratingDipilih, comment);
    setLoading(false);

    if (ownerWaNumber) {
      window.location.href = buildDirectWaComplaintLinkWithComment(
        storeName,
        ownerWaNumber,
        ratingDipilih,
        comment
      );
    } else {
      setStep("selesai");
    }
  }

  if (step === "redirect") {
    return <AutoRedirect url={googleReviewUrl} storeName={storeName} />;
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 px-7 py-10 text-center shadow-xl shadow-black/40">
        {step === "pilih" && (
          <>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
              {storeName}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Bagaimana pengalaman Anda hari ini?
            </p>

            <div className="mt-8 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handlePilihBintang(n)}
                  aria-label={`${n} bintang`}
                  className="rounded-xl p-1.5 text-4xl leading-none opacity-90 transition-all hover:opacity-100 hover:scale-110 active:scale-95"
                >
                  ⭐
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-zinc-500">
              Ketuk salah satu bintang untuk melanjutkan
            </p>
          </>
        )}

        {step === "komentar" && (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
              Terima kasih atas masukannya
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Boleh ceritakan sedikit apa yang kurang berkenan? (opsional)
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis di sini..."
              rows={4}
              autoFocus
              className="mt-5 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
            <div className="mt-4 flex w-full gap-2.5">
              <button
                type="button"
                onClick={handleLewati}
                disabled={loading}
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:bg-zinc-750 disabled:opacity-60"
              >
                Lewati
              </button>
              <button
                type="button"
                onClick={handleKirimKomentar}
                disabled={loading || comment.trim().length === 0}
                className="flex-1 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </>
        )}

        {step === "selesai" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-xl text-emerald-400 ring-1 ring-zinc-700">
              ✓
            </div>
            <h1 className="mt-4 text-lg font-semibold tracking-tight text-zinc-50">
              Terima kasih
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Masukan Anda sudah kami terima dan akan segera ditindaklanjuti
              oleh pihak toko.
            </p>
          </>
        )}

        <p className="mt-8 text-[10px] uppercase tracking-widest text-zinc-700">
          ReviewGate
        </p>
      </div>
    </main>
  );
}
