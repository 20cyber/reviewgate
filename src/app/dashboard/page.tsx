import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDisplayUsername } from "@/lib/username";
import EditCardForm from "@/components/edit-card-form";
import type { Card } from "@/lib/types";
import BrandLanding from "@/components/brand-landing";
import { ResetCardButton } from "./reset-card-button";

const ADMIN_EMAIL = "cyberbarokah@reviewgate.internal";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: stats } = await supabase.rpc("public_stats");
if (!user || user.email !== ADMIN_EMAIL) return <BrandLanding stats={stats} />;
  const isAdmin = user.email === ADMIN_EMAIL;

  const { data: cards } = await supabase
    .from("cards")
    .select("id,unique_code,status,owner_id,store_name,google_review_url,activated_at,created_at")
    .eq("owner_id", user.id)
    .order("activated_at", { ascending: false });

  const list = (cards ?? []) as Card[];

  return (
    <main className="animate-fade-in mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
            Pemilik toko
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Halo, @{getDisplayUsername(user)} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {list.length === 0
              ? "Belum ada kartu — aktivasi kartu pertamamu di bawah."
              : `${list.length} kartu terhubung${list.length > 1 ? "" : ""} ke akunmu.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/aktivasi"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span> Aktivasi Kartu Baru
          </Link>
          <Link
            href="/dashboard/statistik"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            📊 Statistik
          </Link>
          <form
            action={async () => {
              "use server";
              const { createClient } = await import("@/lib/supabase/server");
              const supabase = await createClient();
              await supabase.auth.signOut();
              const { redirect } = await import("next/navigation");
              redirect("/login");
            }}
          >
            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900">
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Stat ringkas */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Total kartu", value: String(list.length), icon: "💳" },
          {
            label: "Aktif",
            value: String(list.filter((c) => c.status === "active").length),
            icon: "✅",
          },
          { label: "Siap di-scan", value: list.length > 0 ? "QR + NFC" : "—", icon: "📲" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-lg">{s.icon}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              {s.value}
            </p>
            <p className="text-xs font-medium text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daftar kartu */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Kartu saya
        </h2>
        {list.length === 0 && (
          <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl ring-1 ring-indigo-100">
              💳
            </div>
            <p className="mt-3 text-[15px] font-semibold text-zinc-900">
              Belum ada kartu terhubung
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
              Scan kartu fisik barumu atau klik aktivasi — bisa juga input kode
              manual tanpa scan.
            </p>
            <Link
              href="/dashboard/aktivasi"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99]"
            >
              Aktivasi sekarang →
            </Link>
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((card, i) => (
            <div
              key={card.id}
              className="animate-fade-up flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              style={{ animationDelay: `${Math.min(i * 0.06, 0.3)}s` }}
            >
              <div className="flex items-start justify-between gap-2">
                <code className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-[13px] font-semibold text-zinc-800 ring-1 ring-zinc-200">
                  {card.unique_code}
                </code>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
                    card.status === "active"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      card.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {card.status === "active" ? "Aktif" : card.status}
                </span>
              </div>

              <p className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
                {card.store_name || <span className="text-zinc-400">Tanpa nama</span>}
              </p>
              {card.google_review_url ? (
                <a
                  href={`/c/${encodeURIComponent(card.unique_code)}?s=test`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 truncate text-[13px] text-indigo-600 hover:underline"
                  title={card.google_review_url}
                >
                  {card.google_review_url}
                </a>
              ) : (
                <p className="mt-0.5 text-[13px] text-zinc-400">Belum ada link review</p>
              )}
              <p className="mt-2 text-xs text-zinc-400">
                Aktif:{" "}
                {card.activated_at
                  ? new Date(card.activated_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "-"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
                <EditCardForm card={card} />
                <Link
                  href={`/c/${encodeURIComponent(card.unique_code)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.97]"
                >
                  Tes ↗
                </Link>
                {isAdmin && card.status === "active" && (
  <ResetCardButton code={card.unique_code} storeName={card.store_name} />
)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
