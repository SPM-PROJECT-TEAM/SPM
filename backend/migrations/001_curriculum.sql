-- Run in the Supabase SQL editor. pgcrypto is available on Supabase projects.
create extension if not exists pgcrypto;

create table if not exists curriculum_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'diksha',
  board text not null,
  grade text,
  subject text,
  framework_id text,
  source_count integer not null default 0,
  fetched_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists curriculum_items (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references curriculum_snapshots(id) on delete cascade,
  diksha_identifier text not null,
  title text not null,
  board text,
  grade_levels text[] not null default '{}',
  subjects text[] not null default '{}',
  topics text[] not null default '{}',
  content_type text,
  medium text,
  raw_metadata jsonb not null,
  created_at timestamptz not null default now(),
  unique(snapshot_id, diksha_identifier)
);

create index if not exists curriculum_items_lookup_idx
  on curriculum_items (board, content_type);
create index if not exists curriculum_items_topics_idx
  on curriculum_items using gin (topics);
