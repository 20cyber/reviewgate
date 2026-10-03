type Stats = { toko: number; langganan: number; kartu: number; scan: number } | null;

const WA =
  "https://wa.me/6283190033720?text=" +
  encodeURIComponent("Halo admin ReviewGate, saya tertarik dengan kartu NFC/QR untuk toko saya.");

const MASALAH = [
  { t: "Pelanggan kecewa", d: "Tidak tahu harus bicara ke siapa, jadi langsung menulis di Google." },
  { t: "Pemilik tidak tahu", d: "Keluhan baru terlihat setelah menjadi ulasan publik." },
  { t: "Calon pelanggan ragu", d: "Rating turun, lalu mereka memilih toko lain." },
];

const CARA = [
  { t: "Tempel kartu", d: "Taruh di kasir atau meja pelanggan." },
  { t: "Scan atau tap", d: "Pelanggan scan QR atau tap NFC, tanpa aplikasi." },
  { t: "Beri bintang", d: "Lanjut menulis ulasan di Google, atau sampaikan langsung ke pemilik." },
];

const PAKET = [
  { n: "Paket 1", t: "Langsung ke Google", d: "Scan atau tap, halaman ulasan Google toko Anda langsung terbuka." },
  { n: "Paket 2", t: "Pilih bintang", d: "Pelanggan memberi bintang. Yang kurang puas bisa menghubungi pemilik lewat WhatsApp.", pop: true },
  { n: "Paket 3", t: "Masukan tersimpan", d: "Semua fitur Paket 2, ditambah kolom komentar yang tersimpan untuk ditindaklanjuti." },
];

const USAHA = ["Kafe & kedai kopi", "Restoran", "Laundry", "Barbershop & salon", "Bengkel", "Klinik & apotek", "Toko & butik", "Hotel & homestay"];

const PESAN = [
  { t: "Hubungi admin", d: "Ceritakan jenis usaha Anda lewat WhatsApp." },
  { t: "Pilih paket", d: "Admin membantu memilih paket yang paling cocok." },
  { t: "Kartu diaktifkan", d: "Admin mengisi data toko, lalu kartu siap dipasang." },
];

const FAQ = [
  ["HP pelanggan tidak punya NFC, bagaimana?", "Kartu juga memiliki QR code. Cukup scan dengan kamera HP."],
  ["Pelanggan harus memasang aplikasi?", "Tidak. Semuanya berjalan di browser HP pelanggan."],
  ["Apakah kartu bisa dipindah ke toko lain?", "Bisa. Admin dapat mengosongkan kartu lalu mengaktifkannya kembali untuk toko baru."],
  ["Apakah ini membuat ulasan palsu?", "Tidak. Semua ulasan tetap ditulis sendiri oleh pelanggan asli di Google."],
  ["Bagaimana kalau link Google Review toko berubah?", "Admin bisa memperbarui link kapan saja tanpa mencetak ulang kartu."],
];

export default function BrandLanding({ stats }: { stats: Stats }) {
  const s = stats ?? { toko: 0, langganan: 0, kartu: 0, scan: 0 };
  const angka = [
    { v: s.toko, l: "Toko memakai NFC" },
    { v: s.langganan, l: "Toko berlangganan" },
    { v: s.kartu, l: "Kartu aktif" },
    { v: s.scan, l: "Total scan" },
  ];
  const btn =
    "inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]";

  return (
    <main>
      <section className="rg-map-bg">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-16 text-center sm:pt-24">
          <span className="inline-flex rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
            QR & NFC ke Google Review
          </span>
          <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl">
            Satu kartu, <span className="text-indigo-600">ulasan Google</span> jadi satu ketukan
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600">
            Pelanggan cukup scan QR atau tap NFC. Tanpa aplikasi, tanpa ribet. Masukan dari yang kurang puas
            bisa langsung sampai ke pemilik toko.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={WA} target="_blank" rel="noreferrer" className={`${btn} bg-indigo-600 text-white shadow-md shadow-blue-600/25 hover:bg-indigo-700`}>
              Hubungi Admin
            </a>
            <a href="#cara-kerja" className={`${btn} border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50`}>
              Lihat Cara Kerja
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 grid max-w-5xl grid-cols-2 gap-3 px-4 lg:grid-cols-4">
        {angka.map((a) => (
          <div key={a.l} className="rounded-2xl bg-white p-5 text-center shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-200">
            <p className="text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">{a.v.toLocaleString("id-ID")}</p>
            <p className="mt-1 text-xs font-medium text-zinc-500">{a.l}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Satu keluhan yang terlambat diketahui bisa dilihat ribuan orang
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {MASALAH.map((m, i) => (
            <div key={m.t} className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">{i + 1}</span>
              <h3 className="mt-3 font-semibold text-zinc-900">{m.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{m.d}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-zinc-600">
          Dengan ReviewGate, semua pelanggan tetap bebas menulis di Google, dan yang kurang puas punya jalur
          tambahan untuk menyampaikan langsung ke pemilik.
        </p>
      </section>

      <section id="cara-kerja" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Cara kerja</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {CARA.map((c, i) => (
              <div key={c.t} className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-zinc-900">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Pilih paket</h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {PAKET.map((p) => (
            <div key={p.n} className={`rounded-2xl bg-white p-6 ${p.pop ? "ring-2 ring-indigo-600" : "ring-1 ring-zinc-200"}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{p.n}</p>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-zinc-500">Hubungi admin untuk harga dan paket yang cocok.</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Cocok untuk usaha apa saja
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {USAHA.map((u) => (
            <span key={u} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 ring-1 ring-zinc-200">
              {u}
            </span>
          ))}
        </div>
      </section>

      <section id="cara-memesan" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Cara memesan</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {PESAN.map((c, i) => (
              <div key={c.t} className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-zinc-900">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-500">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Pertanyaan umum</h2>
        <div className="mt-8 space-y-2.5">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-zinc-900">
                {q}
                <span className="text-lg text-indigo-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{a}</p>
            </details>
          ))}
        </div>
      </section>
      
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="rounded-3xl bg-indigo-600 px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Siap membuat ulasan Google tokomu lebih mudah?</h2>
          <a href={WA} target="_blank" rel="noreferrer" className={`${btn} mt-6 bg-white text-indigo-700 hover:bg-indigo-50`}>
            Konsultasi via WhatsApp
          </a>
        </div>
      </section>

      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        aria-label="Hubungi admin via WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
          <path d="M4 4h16v12H8l-4 4V4z" />
        </svg>
      </a>
    </main>
  );
}