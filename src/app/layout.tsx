import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components/site-chrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "ReviewGate — QR & NFC ke Google Review";
const DESC =
  "Satu kartu, ulasan Google tokomu jadi satu ketukan. Pelanggan scan QR atau tap NFC, tanpa aplikasi.";

export const metadata: Metadata = {
  metadataBase: new URL("https://reviewgate-five.vercel.app"),
  title: TITLE,
  description: DESC,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "/",
    siteName: "ReviewGate",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("rg-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#fafafb] text-zinc-900">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}