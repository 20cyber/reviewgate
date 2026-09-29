import Link from "next/link";
import { redirect } from "next/navigation";
import { getScanStats } from "@/app/actions/cards";

export const dynamic = "force-dynamic";

type Daily = { day: string; total: number; qr: number; nfc: number };
type ByCard = { card_code: string; store_name: string | null; total: number; last_scan: string };
type Hourly = { hour: number; total: number };

export default async function StatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const sp = await searchParams;
  const days = [7, 30, 90].includes(Number(sp.days)) ? Number(sp.days) : 30;
  const { error, daily, byCard, hourly } = await getScanStats(days);
  if (error === "Kamu harus login dulu.") redirect("/login?next=/dashboard/statistik");

  const d = daily as Daily[];
  const c = byCard as ByCard[];
  const h = hourly as Hourly[];

  const total = d.reduce((a, x) => a + Number(x.total), 0);
  const qr = d.reduce((a, x) => a + Number(x.qr), 0);
  const nfc = d.reduce((a, x) => a + Number(x.nfc), 0);
  const peak = h.reduce<Hourly | null>((m, x) => (!m || Number(x.total) > Number(m.total) ? x : m), null);

  const series = Array.from({ length: days }, (_, i) => {
    const day = new Date(Date.now() + 7 * 3600e3 - (days - 1 - i) * 864e5).toISOString().slice(0, 10);
    return { day, total: Number(d.find((r) => r.day === day)?.total ?? 0) };
  });
  const maxDay = Math.max(1, ...series.map((s) => s.total));
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    total: Number(h.find((r) => Number(r.hour) === i)?.total ?? 0),
  }));
  const maxHour = Math.max(1, ...hours.map((x) => x.total));

    const stats: [string, string][] = [
    ["Total scan", String(total)],
    ["Via QR", String(qr)],
    ["Via NFC", String(nfc)],
    ["Tanpa penanda", String(total - qr - nfc)],
    ["Jam paling ramai", peak && total > 0 ? `${String(peak.hour).padStart(2, "0")}.00` : "-"],
  ];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Statistik scan kartu</h1>
          <p className="text-sm text-zinc-500">Jumlah scan QR dan tap NFC, waktu WIB.</p>
        </div>
        <div className="flex gap-1.5">
          {[7, 30, 90].map((n) => (
            <Link
              key={n}
              href={`/dashboard/statistik?days=${n}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ${
                n === days
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-zinc-700 ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {n} hari
            </Link>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      {total === 0 && !error && (
        <p className="mt-6 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
          Belum ada scan tercatat pada periode ini. Untuk mencoba, buka <code>/c/KODE?s=qr</code> dengan kode kartu
          yang sudah aktif.
        </p>
      )}

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Scan per hari</h2>
        <div className="mt-4 flex h-32 items-end gap-[2px]">
          {series.map((s) => (
            <div
              key={s.day}
              title={`${s.day}: ${s.total} scan`}
              className="min-w-[3px] flex-1 rounded-t bg-indigo-500"
              style={{ height: `${Math.max(2, (s.total / maxDay) * 100)}%`, opacity: s.total ? 1 : 0.2 }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
          <span>{series[0]?.day}</span>
          <span>{series[series.length - 1]?.day}</span>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Jam ramai</h2>
        <div className="mt-4 flex h-24 items-end gap-1">
          {hours.map((x) => (
            <div key={x.hour} className="flex flex-1 flex-col items-center gap-1">
              <div
                title={`${String(x.hour).padStart(2, "0")}.00: ${x.total} scan`}
                className="w-full rounded-t bg-emerald-500"
                style={{ height: `${Math.max(2, (x.total / maxHour) * 80)}px`, opacity: x.total ? 1 : 0.2 }}
              />
              <span className="text-[10px] text-zinc-400">{x.hour % 3 === 0 ? x.hour : ""}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-2 font-medium">Toko</th>
              <th className="px-4 py-2 font-medium">Kartu</th>
              <th className="px-4 py-2 font-medium">Scan</th>
              <th className="px-4 py-2 font-medium">Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {c.map((r) => (
              <tr key={r.card_code} className="border-t border-zinc-100">
                <td className="px-4 py-2 font-medium text-zinc-900">{r.store_name ?? "-"}</td>
                <td className="px-4 py-2 text-zinc-600">{r.card_code}</td>
                <td className="px-4 py-2 font-semibold">{r.total}</td>
                <td className="px-4 py-2 text-zinc-500">
                  {new Date(r.last_scan).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
            {c.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-400">
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}