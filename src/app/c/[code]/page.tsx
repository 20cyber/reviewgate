import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ActivateForm from "@/components/activate-form";

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
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("cards")
    .select("unique_code,status,store_name,google_review_url")
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

  // Kartu sudah aktif -> langsung redirect di server, TANPA halaman loading apapun.
  // redirect() dari next/navigation menghentikan render dan mengirim HTTP redirect
  // langsung dari server, jadi browser pelanggan langsung lompat ke Google Review.
  if (card.status === "active" && card.google_review_url) {
    redirect(card.google_review_url);
  }

  // Kartu belum aktif — cek apakah user sudah login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const next = `/c/${encodeURIComponent(code)}`;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <div className="animate-fade-up overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* Banner atas */}
        <div className="bg-indigo-600 px-6 py-8 text-center sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm ring-1 ring-white/25">
            💳
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-100">
            ReviewGate
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Kartu Belum Aktif
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100">
            Kartu ini asli dan siap dipakai. Aktivasi sekali oleh pemilik toko,
            setelah itu pelanggan otomatis ke Google Review.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="flex items-center justify-center">
            <TrustBadge />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-zinc-500">Kode kartu:</span>
            <code className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-sm font-semibold text-zinc-800 ring-1 ring-zinc-200">
              {code}
            </code>
          </div>

          {/* Langkah */}
          <ol className="mt-6 space-y-3 text-left">
            {[
              { n: "1", t: "Login sebagai pemilik toko", d: "Gunakan akun pemilik bisnis kamu." },
              { n: "2", t: "Isi nama toko & link review", d: "Cukup sekali, tersimpan permanen." },
              { n: "3", t: "Kartu langsung aktif", d: "Scan berikutnya auto ke Google Review." },
            ].map((s) => (
              <li key={s.n} className="flex gap-3 rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {s.n}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">{s.t}</span>
                  <span className="block text-xs text-zinc-500">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>

          {!user ? (
            <div className="animate-fade-up stagger-2 mt-6 flex flex-col gap-2.5">
              <Link
                href={`/login?next=${next}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.99]"
              >
                Login untuk Aktivasi →
              </Link>
              <Link
                href={`/register?next=${next}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.99]"
              >
                Belum punya akun? Daftar gratis
              </Link>
              <p className="mt-1 text-center text-xs leading-relaxed text-zinc-400">
                Khusus pemilik kartu. Pelanggan tidak perlu login — setelah
                aktif, halaman ini otomatis mengarah ke Google Review.
              </p>
            </div>
          ) : (
            <div className="animate-fade-in mt-6 rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-emerald-200">
              <p className="text-sm font-semibold text-emerald-800">
                ✓ Kamu sudah login
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                Lengkapi form aktivasi di bawah untuk mengaktifkan kartu ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {user && (
        <div className="animate-fade-up stagger-3 mt-4">
          <ActivateForm initialCode={code} />
        </div>
      )}

      <p className="mt-6 text-center text-xs text-zinc-400">
        🔒 Aman — reviewgate.id • Dilindungi aktivasi pemilik toko
      </p>
    </main>
  );
}
