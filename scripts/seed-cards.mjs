#!/usr/bin/env node
/**
 * ReviewGate — seeding kartu massal + QR cetak.
 *
 * - Generate N kode unik (default 50), insert ke public.cards (status inactive).
 * - Generate QR PNG per kartu (isi = BASE_URL/c/KODE — URL yang SAMA untuk NFC).
 * - Output: cards.csv, manifest.json, qr/*.png, print.html (lembar cetak A4), nfc-instructions.txt
 *
 * Cara pakai:
 *   npm run seed:cards -- --count 100 --prefix RG --base-url https://reviewgate.app
 *   npm run seed:cards -- --count 20 --no-db            # cuma cetak QR tanpa insert DB
 *   npm run seed:cards -- --count 10 --dry-run          # test cepat (5 kartu, tanpa DB)
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (wajib kecuali --no-db / --dry-run)
 *   APP_BASE_URL=https://reviewgate.app (atau via --base-url)
 */

import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // tanpa 0/O, 1/I/L

function parseArgs(argv) {
  const out = {
    count: 50,
    prefix: "RG",
    length: 6,
    baseUrl: "",
    outDir: "",
    noDb: false,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = argv[i + 1];
    if (a === "--count" && next) { out.count = Math.max(1, parseInt(next, 10) || 50); i++; }
    else if (a === "--prefix" && next) { out.prefix = next.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || "RG"; i++; }
    else if (a === "--length" && next) { out.length = Math.min(12, Math.max(4, parseInt(next, 10) || 6)); i++; }
    else if ((a === "--base-url" || a === "--base" || a === "--url") && next) { out.baseUrl = next.replace(/\/$/, ""); i++; }
    else if ((a === "--out" || a === "--out-dir") && next) { out.outDir = next; i++; }
    else if (a === "--no-db") out.noDb = true;
    else if (a === "--dry-run") { out.dryRun = true; out.noDb = true; }
    else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
  }
  if (out.dryRun) out.count = Math.min(out.count, 5);
  return out;
}

function printHelp() {
  console.log(`
ReviewGate seed-cards

  npm run seed:cards -- --count 100 --prefix RG --base-url https://reviewgate.app
  npm run seed:cards -- --count 20 --no-db
  npm run seed:cards -- --count 10 --dry-run
`);
}

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

function randomSuffix(length) {
  const bytes = randomBytes(length);
  let s = "";
  for (let i = 0; i < length; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return s;
}

function generateCodes(count, prefix, length) {
  const set = new Set();
  let guard = 0;
  while (set.size < count && guard < count * 20 + 1000) {
    set.add(`${prefix}-${randomSuffix(length)}`);
    guard++;
  }
  if (set.size < count) throw new Error("Gagal generate kode unik, coba length lebih besar.");
  return [...set];
}

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildPrintHtml({ cards, baseUrl, batch }) {
  const items = cards.map((c) => `
    <div class="card">
      <div class="brand">ReviewGate • ${escHtml(batch)}</div>
      <img src="${c.dataUrl}" alt="QR ${escHtml(c.code)}" />
      <div class="code">${escHtml(c.code)}</div>
      <div class="url">${escHtml(c.url)}</div>
      <div class="hint">Scan QR / tap NFC</div>
    </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>ReviewGate — Lembar Cetak ${escHtml(batch)}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 16px; color: #111; }
  .toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
  .toolbar button { padding: 8px 16px; font-size: 14px; cursor: pointer; }
  .meta { font-size: 12px; color: #555; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8mm; }
  .card { border: 1.5px dashed #999; border-radius: 6px; padding: 4mm; text-align: center; page-break-inside: avoid; }
  .brand { font-size: 10px; letter-spacing: 2px; color: #666; text-transform: uppercase; }
  .card img { width: 38mm; height: 38mm; margin: 2mm auto; }
  .code { font-family: monospace; font-weight: bold; font-size: 15px; margin-top: 1mm; }
  .url { font-size: 9px; color: #444; word-break: break-all; margin-top: 1mm; }
  .hint { font-size: 10px; color: #777; margin-top: 1mm; }
  @media print { body { padding: 0; } .toolbar { display: none; } }
</style></head><body>
  <div class="toolbar">
    <button onclick="window.print()">Cetak / Simpan PDF</button>
    <div class="meta">${cards.length} kartu • batch ${escHtml(batch)} • ${escHtml(baseUrl)} • potong mengikuti garis putus-putus. URL QR = URL yang ditulis ke chip NFC.</div>
  </div>
  <div class="grid">${items}</div>
</body></html>`;
}

async function insertToSupabase({ codes, supabaseUrl, serviceKey }) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const rows = codes.map((unique_code) => ({ unique_code }));
  const CHUNK = 500;
  let inserted = 0;
  const failed = [];

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from("cards").insert(chunk);
    if (!error) {
      inserted += chunk.length;
    } else if (error.code === "23505") {
      // Ada duplikat — coba satu per satu, skip yang konflik
      for (const r of chunk) {
        const { error: e2 } = await supabase.from("cards").insert(r);
        if (!e2) inserted++;
        else failed.push({ code: r.unique_code, message: e2.message });
      }
    } else {
      throw new Error(`Insert Supabase gagal: ${error.message}`);
    }
  }
  return { inserted, failed };
}

async function main() {
  const args = parseArgs(process.argv);
  loadDotEnv(".env.local");
  try { loadDotEnv(".env"); } catch { /* abaikan */ }

  const baseUrl = (args.baseUrl || process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
  const batch = `batch-${stamp}`;
  const outDir = args.outDir || join("output", batch);
  const qrDir = join(outDir, "qr");

  const codes = generateCodes(args.count, args.prefix, args.length);
  const cards = codes.map((code) => ({ code, url: `${baseUrl}/c/${code}` }));

  mkdirSync(qrDir, { recursive: true });

  // 1) Insert DB (kecuali --no-db)
  let dbResult = { inserted: 0, skipped: true, failed: [] };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!args.noDb) {
    if (!supabaseUrl || !serviceKey || supabaseUrl.includes("xyzcompany") || serviceKey.includes("isi-")) {
      console.log("! SUPABASE_SERVICE_ROLE_KEY / URL belum diisi — lewati insert DB (QR tetap dibuat).");
      console.log("  Isi .env.local lalu jalankan ulang tanpa --no-db, atau import cards.csv manual.");
    } else {
      const res = await insertToSupabase({ codes, supabaseUrl, serviceKey });
      dbResult = { ...res, skipped: false };
    }
  }

  // 2) Generate QR (dataURL untuk print.html + PNG untuk cetak individu)
  for (const c of cards) {
    c.dataUrl = await QRCode.toDataURL(c.url, { width: 600, margin: 1, errorCorrectionLevel: "M" });
    const b64 = c.dataUrl.split(",")[1];
    writeFileSync(join(qrDir, `${c.code}.png`), Buffer.from(b64, "base64"));
  }

  // 3) CSV + manifest + instruksi NFC + lembar cetak
  const csv = ["code,url,status", ...cards.map((c) => `${c.code},${c.url},inactive`)].join("\n");
  writeFileSync(join(outDir, "cards.csv"), csv, "utf8");

  const manifest = {
    batch,
    baseUrl,
    count: cards.length,
    prefix: args.prefix,
    createdAt: new Date().toISOString(),
    db: dbResult.skipped ? "skipped (--no-db / kunci belum diisi)" : `inserted ${dbResult.inserted}, failed ${dbResult.failed.length}`,
    cards: cards.map((c) => ({ code: c.code, url: c.url })),
  };
  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  writeFileSync(
    join(outDir, "nfc-instructions.txt"),
    `ReviewGate — tulis NFC (${batch})\n${"=".repeat(40)}\nUntuk tiap kartu, tulis SATU record URL ke chip NFC (tipe "URL"/"URI"):\n\n${cards.map((c) => `${c.code}  ->  ${c.url}`).join("\n")}\n\nURL NFC HARUS SAMA PERSIS dengan kolom url di cards.csv (sama dengan isi QR).\nAplikasi: NFC Tools / NTAG213/215/216. Kunci/lock chip setelah tulis bila perlu.\n`,
    "utf8"
  );

  writeFileSync(join(outDir, "print.html"), buildPrintHtml({ cards, baseUrl, batch }), "utf8");

  console.log(`\nSelesai: ${cards.length} kartu (${batch})`);
  console.log(`  DB   : ${manifest.db}`);
  console.log(`  QR   : ${qrDir}/<KODE>.png`);
  console.log(`  CSV  : ${join(outDir, "cards.csv")}`);
  console.log(`  Cetak: ${join(outDir, "print.html")}  (buka di browser → Cetak / Simpan PDF)`);
  console.log(`  NFC  : ${join(outDir, "nfc-instructions.txt")}`);
  if (dbResult.failed?.length) console.log(`  Gagal insert: ${dbResult.failed.length} (lihat manifest.json)`);
}

main().catch((e) => { console.error("Gagal:", e.message); process.exit(1); });
