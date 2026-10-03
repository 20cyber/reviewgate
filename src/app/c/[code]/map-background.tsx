import type { ReactNode } from "react";

export default function MapScreen({ children }: { children: ReactNode }) {
  return (
    <div className="light-scope fixed inset-0 z-[100] bg-[#f2f0ea]">
      <svg
        aria-hidden="true"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <rect width="400" height="800" fill="#f2f0ea" />
        {/* taman */}
        <rect x="-20" y="50" width="160" height="120" rx="18" fill="#cfe8c6" />
        <rect x="270" y="560" width="160" height="110" rx="18" fill="#cfe8c6" />
        {/* air */}
        <path
          d="M-10 690 C 80 650, 150 740, 240 715 S 360 770, 420 735 L 420 820 L -10 820 Z"
          fill="#b5d8f0"
        />
        {/* jalan */}
        <g fill="none" stroke="#fff" strokeLinecap="round">
          <g strokeWidth="9">
            <path d="M-10 120 L410 200" />
            <path d="M-10 330 L410 300" />
            <path d="M-10 520 L410 480" />
            <path d="M90 -10 L130 820" />
            <path d="M270 -10 L240 820" />
          </g>
          <g strokeWidth="4">
            <path d="M-10 240 L410 250" />
            <path d="M-10 610 L410 580" />
            <path d="M180 -10 L190 820" />
            <path d="M340 -10 L330 820" />
            <path d="M30 -10 L50 820" />
          </g>
        </g>
        {/* jalan utama */}
        <path d="M-10 410 C120 380 280 440 410 400" fill="none" stroke="#f0c96b" strokeWidth="17" strokeLinecap="round" />
        <path d="M-10 410 C120 380 280 440 410 400" fill="none" stroke="#fbe3a1" strokeWidth="13" strokeLinecap="round" />
        {/* penanda lokasi kecil */}
        <g fill="#ea4335" opacity="0.35">
          <path transform="translate(60 260)" d="M0 0C-6-9-9-13-9-19a9 9 0 1 1 18 0C9-13 6-9 0 0z" />
          <path transform="translate(320 150)" d="M0 0C-6-9-9-13-9-19a9 9 0 1 1 18 0C9-13 6-9 0 0z" />
          <path transform="translate(300 520)" d="M0 0C-6-9-9-13-9-19a9 9 0 1 1 18 0C9-13 6-9 0 0z" />
          <path transform="translate(110 600)" d="M0 0C-6-9-9-13-9-19a9 9 0 1 1 18 0C9-13 6-9 0 0z" />
        </g>
      </svg>

      {/* lapisan gradien lembut supaya kartu lebih menonjol */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-white/10 to-white/60" />

      <div className="relative h-full overflow-y-auto">
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
          {children}

          <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
            Didukung ReviewGate
          </p>
        </div>
      </div>
    </div>
  );
}