// src/app/dashboard/my-cards/page.tsx
//
// Daftar kartu yang dimiliki akun yang sedang login.
// Dipakai untuk kelola kartu demo saat presentasi ke calon toko:
// - edit nama toko & link review berkali-kali (simulasi tawarkan ke toko berbeda)
// - "lepas" kartu begitu ada toko yang beneran setuju, supaya toko itu
//   bisa scan & aktivasi sendiri pakai akun mereka sendiri

import Link from "next/link";
import { getMyCards } from "@/app/actions/cards";
import MyCardItem from "@/components/my-card-item";

export default async function MyCardsPage() {
  const { error, cards } = await getMyCards();

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/login" className="mt-4 inline-block text-sm text-indigo-600 underline">
          Login dulu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Kartu Saya
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Kartu-kartu yang sedang kamu pegang, termasuk kartu demo untuk presentasi ke calon toko.
      </p>

      {cards.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          Belum ada kartu yang kamu aktivasi. Scan salah satu kartu fisik untuk mulai.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {cards.map((card) => (
            <MyCardItem key={card.id} card={card} />
          ))}
        </div>
      )}
    </main>
  );
}