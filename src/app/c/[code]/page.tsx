import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ActivateForm from "@/components/activate-form";
import RatingFilter from "./rating-filter";
import { isAdminEmail, ADMIN_WA } from "@/lib/admin";

function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path
          fillRule="evenodd"
          d="M10 1.5l7 2.6v5.2c0 4.6-3 8.4-7 9.2-4-.8-7-4.6-7-9.2V4.1l7-2.6zm3.7 6.2a1 1 0 00-1.4-1.4L9 9.6 7.7 8.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Kartu asli ReviewGate
    </div>
  );
}

export default async function CardPage(props: PageProps<"/c/[code]">) {
  const { code } = await props.params;
  const sp = await props.searchParams;
  const s = Array.isArray(sp.s) ? sp.s[0] : sp.s;
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("cards")
    .select(
      "id,unique_code,status,store_name,google_review_url,package,owner_wa_number"
    )
    .eq("unique_code", code)
    .single();

  if (!card) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="animate-fade-up w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-xl">
            🔍
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900">
            Kartu tidak ditemukan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Kode{" "}
            <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] font-medium text-zinc-700">
              {code}
            </code>{" "}
            tidak terdaftar di sistem kami. Pastikan kamu scan QR atau tap NFC
            yang benar.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99]"
          >
            Kembali ke Beranda
          </Link>
          <p className="mt-4 text-xs text-zinc-400">
            Butuh bantuan? Hubungi toko tempat kamu mendapatkan kartu ini.
          </p>
        </div>
      </main>
    );
  }

  if (card.status === "active" && card.google_review_url) {
    // Catat scan-nya dulu, berlaku untuk semua paket
    if (s !== "test") {
      try {
        await supabase.rpc("record_scan", {
          p_code: code,
          p_source: s === "nfc" || s === "qr" ? s : "unknown",
        });
      } catch {}
    }

    // PAKET 1: tanpa filter sama sekali, langsung ke Google Review
    // (persis seperti perilaku sebelumnya)
    if (card.package === "paket1" || !card.package) {
      redirect(card.google_review_url);
    }

    // PAKET 2 & 3: tampilkan halaman pilih bintang dulu
    return (
      <RatingFilter
        cardId={card.id}
        storeName={card.store_name}
        googleReviewUrl={card.google_review_url}
        ownerWaNumber={card.owner_wa_number}
        packageType={card.package as "paket2" | "paket3"}
      />
    );
  }

    // Kartu belum aktif: hanya admin yang bisa mengaktifkan
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);
  const wa =
    `https://wa.me/${ADMIN_WA}?text=` +
    encodeURIComponent(`Halo admin ReviewGate, kartu ${code} belum aktif.`);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="animate-fade-up overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="bg-indigo-600 px-6 py-8 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-100">
            ReviewGate
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Kartu Belum Aktif
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100">
            Kartu ini asli dan siap dipakai. Aktivasi dilakukan oleh admin
            ReviewGate, setelah itu scan otomatis menuju Google Review.
          </p>
        </div>
        <div className="px-6 py-6 text-center sm:px-8">
          <TrustBadge />
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-zinc-500">Kode kartu:</span>
            <code className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-sm font-semibold text-zinc-800 ring-1 ring-zinc-200">
              {code}
            </code>
          </div>
          {!isAdmin && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.99]"
            >
              Hubungi Admin
            </a>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="animate-fade-up stagger-2 mt-4">
          <ActivateForm initialCode={code} />
        </div>
      )}
    </main>
  );
}