import Link from "next/link";
import ThemeToggle from "./theme-toggle";

function PinMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"
      />
      <circle cx="12" cy="9" r="2.8" fill="#1a73e8" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a73e8] text-white shadow-sm shadow-blue-600/30 transition-all group-hover:bg-[#1967d2] group-hover:shadow-md">
        <PinMark className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            ReviewGate
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-zinc-500">
            QR & NFC ke Google Review
          </span>
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 sm:block"
          >
            Masuk
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:bg-[#1967d2] hover:shadow-md active:scale-[0.98] sm:px-5 sm:py-2.5"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1a73e8] text-white">
            <PinMark className="h-3.5 w-3.5" />
          </span>
          <span>
            <span className="font-semibold text-zinc-700">ReviewGate</span> — satu
            kartu untuk semua ulasan Google.
          </span>
        </div>
        <p>Scan QR / tap NFC → otomatis ke Google Review.</p>
      </div>
    </footer>
  );
}