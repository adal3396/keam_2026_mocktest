create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_no text not null unique,
  application_no text not null unique,
  exam_center text,
  dob date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  roll_no text not null,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  answers jsonb not null default '{}'::jsonb,
  marked_for_review jsonb not null default '[]'::jsonb,
  visited jsonb not null default '[]'::jsonb,
  is_submitted boolean not null default false,
  total_score integer,
  correct_count integer,
  wrong_count integer,
  unattempted_count integer,
  time_taken_seconds integer,
  math_score integer,
  physics_score integer,
  chemistry_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_exam_sessions_student_id on public.exam_sessions(student_id);
create index if not exists idx_exam_sessions_submitted on public.exam_sessions(is_submitted);

alter table public.students enable row level security;
alter table public.exam_sessions enable row level security;

drop policy if exists "allow anon read_write students" on public.students;
create policy "allow anon read_write students"
on public.students
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "allow anon read_write sessions" on public.exam_sessions;
create policy "allow anon read_write sessions"
on public.exam_sessions
for all
to anon, authenticated
using (true)
with check (true);
