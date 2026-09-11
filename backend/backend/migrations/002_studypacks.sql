-- Migration 002: Study Packs & Content Reports
-- Run in Supabase SQL editor or Postgres environment.

create table if not exists study_packs (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null unique,
  board text not null,
  grade text not null,
  subject text not null,
  chapter_id text not null,
  chapter_title text not null,
  medium text not null default 'English',
  version text not null default '1.2',
  pack_data jsonb not null,
  quality_score double precision not null default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists study_packs_lookup_idx
  on study_packs (board, grade, subject, chapter_id);

create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  pack_id text not null,
  chapter_title text not null,
  item_type text not null, -- 'mcq' | 'practice_question' | 'flashcard' | 'notes'
  item_id text,
  reason text not null,
  details text,
  status text not null default 'pending', -- 'pending' | 'reviewed' | 'resolved'
  reported_at timestamptz not null default now()
);

create index if not exists content_reports_status_idx
  on content_reports (status, reported_at);
