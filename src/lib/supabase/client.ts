import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Guard: secret key (sb_secret_*) tidak boleh dipakai di browser.
  // Supabase akan menolaknya dengan "Forbidden use of secret API key in browser".
  // Ini biasanya terjadi karena NEXT_PUBLIC_SUPABASE_ANON_KEY salah diisi
  // dengan secret key, atau dev server belum di-restart setelah .env.local diperbaiki
  // sehingga chunk lama (cache .next) masih membawa key lama.
  if (anonKey.startsWith("sb_secret_")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY terisi secret key (sb_secret_*). " +
        "Ganti dengan publishable key (sb_publishable_*) dari Dashboard > Settings > API Keys, " +
        "lalu restart dev server."
    );
  }

  return createBrowserClient(url, anonKey);
}
