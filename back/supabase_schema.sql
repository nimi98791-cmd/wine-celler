-- ============================================================
--  Wine Cellar — Supabase SQL Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto"; -- needed for gen_random_uuid() on older Postgres

create table if not exists wines (
  id                uuid          primary key default gen_random_uuid(),

  -- Core identification
  wine_name         text          not null,
  winery            text          not null,
  vintage           smallint      check (vintage is null or (vintage >= 1800 and vintage <= extract(year from now()))),
  type              text          not null check (type in ('Red','White','Rosé','Sparkling','Dessert','Fortified','Orange')),

  -- Tasting & value
  characteristics   text          not null,
  estimated_price   numeric(10,2) check (estimated_price is null or estimated_price >= 0),
  rating_out_of_100 smallint      check (rating_out_of_100 is null or (rating_out_of_100 between 50 and 100)),

  -- Cellaring advice
  aging_potential   text,
  drink_now         boolean       not null default false,

  -- Audit
  scanned_at        timestamptz   not null default now()
);

-- Index for common queries
create index if not exists wines_type_idx        on wines (type);
create index if not exists wines_vintage_idx     on wines (vintage);
create index if not exists wines_scanned_at_idx  on wines (scanned_at desc);

-- ── Optional: Row Level Security ─────────────────────────────────────────────
-- Uncomment these lines if you add user authentication later.
-- alter table wines enable row level security;
-- create policy "Users can manage their own wines" on wines
--   using (auth.uid() = user_id);  -- requires adding a user_id column first
