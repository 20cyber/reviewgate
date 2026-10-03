"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeReviewUrl } from "@/lib/review-url";
import { isAdminEmail } from "@/lib/admin";

export async function activateCard(
  uniqueCode: string,
  storeName: string,
  reviewInput: string,
  packageType: "paket1" | "paket2" | "paket3" = "paket1",
  ownerWaNumber: string = ""
) {
  const code = uniqueCode.trim();
  const name = storeName.trim();
  const url = normalizeReviewUrl(reviewInput);
  const wa = ownerWaNumber.trim();

  if (!code || !name || !url) {
    return { error: "Kode kartu, nama toko, dan link Google Review wajib diisi." };
  }

  if ((packageType === "paket2" || packageType === "paket3") && !wa) {
    return { error: "Nomor WA owner toko wajib diisi untuk Paket 2 dan Paket 3." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return { error: "Hanya admin yang bisa mengelola kartu." };

  const { data: existing, error: readError } = await supabase
    .from("cards")
    .select("id,status,owner_id")
    .eq("unique_code", code)
    .single();

  if (readError || !existing) return { error: "Kode kartu tidak ditemukan." };
  if (existing.status === "active" && existing.owner_id !== user.id) {
    return { error: "Kartu ini sudah dimiliki akun lain." };
  }

  const { error } = await supabase
    .from("cards")
    .update({
      status: "active",
      store_name: name,
      google_review_url: url,
      owner_id: user.id,
      activated_at: new Date().toISOString(),
      package: packageType,
      owner_wa_number: wa || null,
    })
    .eq("unique_code", code);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath(`/c/${code}`);
  return { error: null };
}

export async function updateCard(
  cardId: string,
  storeName: string,
  reviewInput: string,
  packageType: "paket1" | "paket2" | "paket3" = "paket1",
  ownerWaNumber: string = ""
) {
  const name = storeName.trim();
  const url = normalizeReviewUrl(reviewInput);
  const wa = ownerWaNumber.trim();

  if (!name || !url) {
    return { error: "Nama toko dan link Google Review wajib diisi." };
  }
  if ((packageType === "paket2" || packageType === "paket3") && !wa) {
    return { error: "Nomor WA owner toko wajib diisi untuk Paket 2 dan Paket 3." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return { error: "Hanya admin yang bisa mengelola kartu." };

  const { error } = await supabase
    .from("cards")
    .update({
      store_name: name,
      google_review_url: url,
      package: packageType,
      owner_wa_number: wa || null,
    })
    .eq("id", cardId)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

/**
 * getMyCards
 * Ambil semua kartu yang dimiliki akun admin (owner_id = akun yang sedang login).
 * Karena semua kartu diaktivasi & dikelola sendiri oleh admin (toko tidak pernah
 * login), ini pada dasarnya menampilkan SEMUA kartu yang pernah diaktivasi.
 */
export async function getMyCards() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu harus login dulu.", cards: [] };

  const { data, error } = await supabase
    .from("cards")
    .select(
      "id,unique_code,status,store_name,google_review_url,activated_at,package,owner_wa_number"
    )
    .eq("owner_id", user.id)
    .order("activated_at", { ascending: false });

  if (error) return { error: error.message, cards: [] };
  return { error: null, cards: data ?? [] };
}

export async function getScanStats(days = 30) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Kamu harus login dulu.", daily: [], byCard: [], hourly: [] };
  }

  const [d, c, h] = await Promise.all([
    supabase.rpc("scan_daily", { p_days: days }),
    supabase.rpc("scan_by_card", { p_days: days }),
    supabase.rpc("scan_hourly", { p_days: days }),
  ]);

  const error = d.error?.message ?? c.error?.message ?? h.error?.message ?? null;
  return { error, daily: d.data ?? [], byCard: c.data ?? [], hourly: h.data ?? [] };
}
