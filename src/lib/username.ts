// Helper tunggal untuk auth berbasis username.
// User hanya melihat "username". Di balik layar Supabase Auth tetap butuh
// email, jadi username dikonversi ke email palsu: <username>@reviewgate.internal.

export const FAKE_EMAIL_DOMAIN = "reviewgate.internal";

export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const USERNAME_MIN_LENGTH = 4;

/** Normalisasi: trim + lowercase agar "Budi123" dan "budi123" dianggap sama. */
export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

/** Validasi username. Return pesan error (Indonesia) atau null kalau valid. */
export function validateUsername(input: string): string | null {
  const username = normalizeUsername(input);
  if (username.length < USERNAME_MIN_LENGTH) {
    return "Username minimal 4 karakter.";
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Username hanya boleh huruf, angka, dan underscore (tanpa spasi).";
  }
  return null;
}

/** username -> email palsu untuk Supabase Auth. Selalu validasi dulu. */
export function usernameToEmail(input: string): string {
  return `${normalizeUsername(input)}@${FAKE_EMAIL_DOMAIN}`;
}

/** email palsu -> username untuk ditampilkan. Fallback: prefix sebelum "@". */
export function emailToUsername(email: string | null | undefined): string {
  if (!email) return "-";
  const suffix = `@${FAKE_EMAIL_DOMAIN}`;
  if (email.toLowerCase().endsWith(suffix)) {
    return email.slice(0, -suffix.length);
  }
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

type AuthUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

/** Ambil username untuk ditampilkan; jangan pernah tampilkan email palsu. */
export function getDisplayUsername(user: AuthUserLike | null | undefined): string {
  const meta = user?.user_metadata?.["username"];
  if (typeof meta === "string" && meta.length > 0) return meta;
  return emailToUsername(user?.email);
}

/** Petakan error teknis Supabase saat daftar ke pesan yang ramah. */
export function mapSignUpError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("already registered") ||
    lower.includes("already exists") ||
    lower.includes("already been registered") ||
    lower.includes("user already") ||
    lower.includes("duplicate") ||
    lower.includes("user_already_exists")
  ) {
    return "Username sudah dipakai, coba yang lain.";
  }
  return message;
}

/** Petakan error login ke pesan yang ramah (tanpa membocorkan info). */
export function mapSignInError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid_login_credentials")) {
    return "Username atau password salah.";
  }
  if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
    return "Akun belum dikonfirmasi. Matikan 'Confirm email' di Dashboard Supabase (lihat panduan), lalu daftar ulang.";
  }
  return message;
}
