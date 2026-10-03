"use client";

import { useState } from "react";
import { submitComplaint } from "@/app/actions/reviews";
import {
  buildDirectWaComplaintLink,
  buildDirectWaComplaintLinkWithComment,
} from "@/lib/report-utils";
import MapScreen from "./map-background";

type Props = {
  cardId: string;
  storeName: string;
  googleReviewUrl: string;
  ownerWaNumber: string | null;
  packageType: "paket2" | "paket3";
};

const LABELS = ["Sangat kurang", "Kurang", "Cukup", "Baik", "Luar biasa"];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-11 w-11 transition-all duration-150 ${
        filled
          ? "scale-105 fill-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.55)]"
          : "fill-zinc-200"
      }`}
    >
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
    </svg>
  );
}

function PinBadge() {
  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
      <span className="absolute inset-0 animate-ping rounded-full bg-red-400/30" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-zinc-200">
        <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
          <path
            fill="#ea4335"
            d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
          />
          <circle cx="12" cy="9" r="2.8" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-zinc-200">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600 ring-1 ring-emerald-200">
          ✓
        </span>
      </div>
    </div>
  );
}

export default function RatingFilter({
  cardId,
  storeName,
  googleReviewUrl,
  ownerWaNumber,
  packageType,
}: Props) {
  const [step, setStep] = useState<"pilih" | "pilihan" | "komentar" | "selesai">("pilih")
  const [ratingDipilih, setRatingDipilih] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  function bukaWaTemplateAtauSelesai(rating: number) {
    if (ownerWaNumber) {
      window.location.href = buildDirectWaComplaintLink(storeName, ownerWaNumber, rating);
    } else {
      setStep("selesai");
    }
  }

  function handlePilihBintang(rating: number) {
    if (redirecting) return;
    setRatingDipilih(rating);

    if (rating >= 3) {
      setRedirecting(true);
      setHover(rating);
      window.location.href = googleReviewUrl;
      return;
    }

    setStep("pilihan");

    
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

  return (
    <MapScreen>
      <div className="animate-fade-up relative mt-8 w-full max-w-sm rounded-3xl bg-white/95 px-7 pb-8 pt-12 text-center shadow-2xl shadow-zinc-900/15 ring-1 ring-black/5 backdrop-blur">
        {step === "selesai" ? <CheckBadge /> : <PinBadge />}

        {step === "pilih" && (
          <>
            <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-zinc-900">
              {storeName}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Bagaimana pengalaman Anda hari ini?
            </p>

            <div
              className="mt-7 flex justify-center gap-0.5"
              onMouseLeave={() => !redirecting && setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={redirecting}
                  onClick={() => handlePilihBintang(n)}
                  onMouseEnter={() => !redirecting && setHover(n)}
                  onTouchStart={() => !redirecting && setHover(n)}
                  aria-label={`${n} bintang`}
                  className="rounded-xl p-1 transition-transform hover:scale-110 active:scale-95 disabled:cursor-default"
                >
                  <Star filled={n <= hover} />
                </button>
              ))}
            </div>

            <p className="mt-4 h-5 text-sm font-medium text-zinc-700">
  {redirecting
    ? "Membuka Google Review…"
    : hover > 0
    ? LABELS[hover - 1]
    : ""}
</p>
<p className="mt-1 text-[13px] text-zinc-500">
  Pilih salah satu bintang untuk melanjutkan
</p>
          </>
        )}

        {step === "pilihan" && (
  <>
    <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
      Mohon maaf atas pengalaman Anda
    </h1>
    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
      Bagaimana Anda ingin menyampaikannya?
    </p>
    <div className="mt-5 flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() =>
          ratingDipilih &&
          (packageType === "paket2"
            ? bukaWaTemplateAtauSelesai(ratingDipilih)
            : setStep("komentar"))
        }
        className="rounded-xl bg-[#1a73e8] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1765cc]"
      >
        Sampaikan langsung ke pemilik
      </button>
      <a
        href={googleReviewUrl}
        className="rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
      >
        Tetap tulis ulasan di Google
      </a>
    </div>
  </>
)}

        {step === "komentar" && (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
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
              autoFocus
              className="mt-5 w-full resize-none rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-[#1a73e8] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
            />
            <div className="mt-4 flex w-full gap-2.5">
              <button
                type="button"
                onClick={handleLewati}
                disabled={loading}
                className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-200 disabled:opacity-60"
              >
                Lewati
              </button>
              <button
                type="button"
                onClick={handleKirimKomentar}
                disabled={loading || comment.trim().length === 0}
                className="flex-1 rounded-xl bg-[#1a73e8] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1765cc] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </>
        )}

        {step === "selesai" && (
          <>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Terima kasih
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Masukan Anda sudah kami terima dan akan segera ditindaklanjuti
              oleh pihak toko.
            </p>
          </>
        )}
      </div>
    </MapScreen>
  );
}