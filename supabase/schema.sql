-- ReviewGate — skema Supabase/Postgres
-- Jalankan di SQL Editor Supabase (atau via migration).

-- 1) Enum status
do $$ begin
  create type card_status as enum ('inactive', 'active');
exception when duplicate_object then null;
end $$;

-- 2) Tabel cards
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  unique_code text unique not null,
  status card_status not null default 'inactive',
  owner_id uuid null references auth.users(id) on delete set null,
  store_name text null,
  google_review_url text null,
  activated_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists cards_unique_code_idx on public.cards (unique_code);
create index if not exists cards_owner_idx on public.cards (owner_id);

-- 3) Row Level Security
alter table public.cards enable row level security;

drop policy if exists "Public read cards" on public.cards;
create policy "Public read cards"
  on public.cards for select
  to anon, authenticated
  using (true);

drop policy if exists "Owner update own cards + claim inactive" on public.cards;
create policy "Owner update own cards + claim inactive"
  on public.cards for update
  to authenticated
  using (owner_id is null or owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Tidak ada policy INSERT untuk client:
-- kartu massal dibuat via Service Role / SQL Editor:
--   insert into public.cards (unique_code) values ('RG-ABC123'), ('RG-DEF456');

-- Contoh data dev (opsional):
-- insert into public.cards (unique_code) values ('DEMO-001') on conflict do nothing;
