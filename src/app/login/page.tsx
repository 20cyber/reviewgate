"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthPhoneTap } from "@/components/auth-phone-tap";
import {
  mapSignInError,
  usernameToEmail,
  validateUsername,
} from "@/lib/username";

function LoginInner() {
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
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    setLoading(false);
    if (error) setError(mapSignInError(error.message));
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
              Selamat datang kembali
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Login untuk mengaktivasi & mengelola kartu toko kamu.
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
                placeholder="mis. kopibarokah"
                className="rg-input w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-zinc-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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
              {loading ? "Masuk…" : "Masuk →"}
            </button>
          </form>

          <div className="border-t border-zinc-100 bg-zinc-50/60 px-7 py-4 text-center sm:px-9">
            <p className="text-sm text-zinc-500">
              Belum punya akun?{" "}
              <Link
                href={`/register?next=${encodeURIComponent(next)}`}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Daftar gratis
              </Link>
            </p>
          </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          🔒 Login aman — hanya pemilik toko yang bisa aktivasi kartu.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
