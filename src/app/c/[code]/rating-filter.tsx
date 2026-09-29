"use client";

import { useState } from "react";
import { submitComplaint } from "@/app/actions/reviews";
import { buildDirectWaComplaintLink } from "@/lib/report-utils";
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

  function handlePilihBintang(rating: number) {
    setRatingDipilih(rating);

    // Bintang 3-5 -> ke Google Review (pakai animasi yang sudah ada)
    if (rating >= 3) {
      setStep("redirect");
      return;
    }

    // Bintang 1-2, Paket 2 -> langsung buka WA, tanpa simpan data
    if (packageType === "paket2") {
      if (ownerWaNumber) {
        window.location.href = buildDirectWaComplaintLink(storeName, ownerWaNumber, rating);
      } else {
        setStep("selesai");
      }
      return;
    }

    // Bintang 1-2, Paket 3 -> tampilkan kolom komentar opsional dulu
    setStep("komentar");
  }

  async function handleKirimKomentar(withComment: boolean) {
    if (!ratingDipilih) return;
    setLoading(true);
    await submitComplaint(cardId, ratingDipilih, withComment ? comment : null);
    setLoading(false);
    setStep("selesai");
  }

  if (step === "redirect") {
    return <AutoRedirect url={googleReviewUrl} storeName={storeName} />;
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="animate-fade-up overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-6 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[11px] font-bold text-white">
            R
          </span>
          <span className="text-xs font-semibold tracking-wide text-zinc-700">
            ReviewGate
          </span>
        </div>

        <div className="flex flex-col items-center px-6 py-8 text-center sm:px-8">
          {step === "pilih" && (
            <>
              <p className="text-xs font-medium text-zinc-400">{storeName}</p>
              <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                Bagaimana pengalaman Anda?
              </h1>
              <div className="mt-6 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handlePilihBintang(n)}
                    aria-label={`${n} bintang`}
                    className="p-1.5 text-4xl leading-none transition-transform active:scale-90"
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">Ketuk salah satu bintang di atas</p>
            </>
          )}

          {step === "komentar" && (
            <>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Terima kasih atas masukannya
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Boleh ceritakan sedikit apa yang kurang berkenan? (opsional)
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis di sini..."
                rows={4}
                className="mt-4 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
              <div className="mt-4 flex w-full gap-2.5">
                <button
                  type="button"
                  onClick={() => handleKirimKomentar(false)}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-60"
                >
                  Lewati
                </button>
                <button
                  type="button"
                  onClick={() => handleKirimKomentar(true)}
                  disabled={loading || comment.trim().length === 0}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </>
          )}

          {step === "selesai" && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl ring-1 ring-emerald-200">
                ✓
              </div>
              <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900">
                Terima kasih
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Masukan Anda sudah kami terima dan akan segera ditindaklanjuti
                oleh pihak toko.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
