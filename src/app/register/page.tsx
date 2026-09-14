"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthPhoneTap } from "@/components/auth-phone-tap";
import {
  mapSignUpError,
  normalizeUsername,
  usernameToEmail,
  validateUsername,
} from "@/lib/username";

function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const cleanUsername = normalizeUsername(username);
    // Username dikonversi ke email palsu hanya untuk Supabase Auth,
    // tidak pernah ditampilkan ke user.
    const { error } = await supabase.auth.signUp({
      email: usernameToEmail(cleanUsername),
      password,
      options: { data: { username: cleanUsername } },
    });
    setLoading(false);
    if (error) setError(mapSignUpError(error.message));
    else {
      router.push(next);
      router.refresh();
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="animate-fade-up w-full max-w-md">
        <AuthPhoneTap />
        <div className="rg-beam-wrap">
          <div className="rg-beam-inner">
          <div className="px-7 pt-8 pb-2 text-center sm:px-9">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                R
              </span>
              <span className="text-left leading-none">
                <span className="block text-[15px] font-semibold tracking-tight text-zinc-900">
                  ReviewGate
                </span>
                <span className="block text-[11px] font-medium text-zinc-500">
                  QR & NFC ke Google Review
                </span>
              </span>
            </Link>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900">
              Buat akun toko
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Gratis. Cukup username + password untuk mulai aktivasi kartu.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3.5 px-7 py-6 sm:px-9">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
                Username
              </label>
              <input
                type="text"
                required
                minLength={4}
                pattern="[a-zA-Z0-9_]+"
                title="Huruf, angka, dan underscore saja (min. 4 karakter, tanpa spasi)"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mis. kopibarokah (min. 4 karakter)"
                className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
              <p className="mt-1.5 text-xs text-zinc-400">
                Huruf, angka & underscore saja — tanpa spasi.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                autoComplete="new-password"
                className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            {error && (
              <p className="animate-fade-in rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700 ring-1 ring-red-200">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Mendaftar…" : "Daftar & Lanjutkan →"}
            </button>
          </form>

          <div className="border-t border-zinc-100 bg-zinc-50/60 px-7 py-4 text-center sm:px-9">
            <p className="text-sm text-zinc-500">
              Sudah punya akun?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Masuk
              </Link>
            </p>
          </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          Dengan mendaftar kamu bisa langsung aktivasi kartu fisik tokomu.
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterInner />
    </Suspense>
  );
}
