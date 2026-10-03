import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ActivateForm from "@/components/activate-form";
import { isAdminEmail } from "@/lib/admin";

export default async function AktivasiPage(props: PageProps<"/dashboard/aktivasi">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/aktivasi");
  if (!isAdminEmail(user.email)) redirect("/dashboard");

  const searchParams = await props.searchParams;
  const preset = typeof searchParams?.code === "string" ? searchParams.code : "";

  return (
    <main className="animate-fade-in mx-auto w-full max-w-md px-4 py-8 sm:py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-all hover:text-zinc-900"
      >
        ← Kembali ke dashboard
      </Link>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
          Kartu baru
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Aktivasi Kartu Baru
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
          Input kode kartu manual (tanpa scan) atau dari hasil scan QR/NFC.
          Setelah aktif, pelanggan otomatis ke Google Review.
        </p>
      </div>
      <div className="animate-fade-up stagger-1 mt-5">
        <ActivateForm initialCode={preset} />
      </div>
    </main>
  );
}
