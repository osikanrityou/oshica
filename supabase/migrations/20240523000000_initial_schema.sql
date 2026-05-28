-- Oshica initial schema
-- Apply: supabase db push (local) or supabase migration up

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.oshi_category as enum (
  'anime', 'vtuber', 'game', 'idol', 'other'
);

create type public.plan_type as enum ('free', 'pro');

create type public.reservation_type as enum (
  'goods', 'cafe', 'collab', 'other'
);

create type public.reservation_status as enum (
  'planned', 'reserved', 'picked_up', 'cancelled'
);

create type public.event_status as enum (
  'draft', 'applied', 'awaiting_result', 'done', 'cancelled'
);

create type public.lottery_result_value as enum (
  'won', 'lost', 'pending', 'cancelled'
);

create type public.lottery_source_type as enum (
  'reservation', 'event_application', 'standalone'
);

create type public.expense_category as enum (
  'goods', 'ticket', 'cafe', 'transport', 'merch', 'other'
);

create type public.reminder_target_type as enum (
  'reservation', 'event_application', 'lottery_result'
);

create type public.reminder_channel as enum ('in_app', 'email');

-- ---------------------------------------------------------------------------
-- Utility
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Tokyo',
  currency text not null default 'JPY',
  plan public.plan_type not null default 'free',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- oshis
-- ---------------------------------------------------------------------------
create table public.oshis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category public.oshi_category not null default 'other',
  color text,
  memo text,
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index oshis_user_id_idx on public.oshis (user_id);
create index oshis_user_id_archived_idx on public.oshis (user_id, is_archived);

create trigger oshis_set_updated_at
  before update on public.oshis
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- reservations
-- ---------------------------------------------------------------------------
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  oshi_id uuid references public.oshis (id) on delete set null,
  type public.reservation_type not null default 'goods',
  title text not null,
  status public.reservation_status not null default 'planned',
  reserved_at timestamptz,
  deadline_at timestamptz,
  location text,
  store_url text,
  estimated_amount integer check (estimated_amount is null or estimated_amount >= 0),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index reservations_user_id_idx on public.reservations (user_id);
create index reservations_user_status_idx on public.reservations (user_id, status);
create index reservations_user_deadline_idx on public.reservations (user_id, deadline_at);

create trigger reservations_set_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- event_applications
-- ---------------------------------------------------------------------------
create table public.event_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  oshi_id uuid references public.oshis (id) on delete set null,
  title text not null,
  event_at timestamptz,
  application_deadline_at timestamptz,
  result_announce_at timestamptz,
  status public.event_status not null default 'draft',
  ticket_count integer not null default 1 check (ticket_count >= 1),
  estimated_amount integer check (estimated_amount is null or estimated_amount >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index event_applications_user_id_idx on public.event_applications (user_id);
create index event_applications_user_status_idx on public.event_applications (user_id, status);
create index event_applications_user_deadline_idx
  on public.event_applications (user_id, application_deadline_at);

create trigger event_applications_set_updated_at
  before update on public.event_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- lottery_results
-- ---------------------------------------------------------------------------
create table public.lottery_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_type public.lottery_source_type not null,
  source_id uuid,
  result public.lottery_result_value not null default 'pending',
  announced_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint lottery_source_consistency check (
    (source_type = 'standalone' and source_id is null)
    or (source_type <> 'standalone' and source_id is not null)
  )
);

create index lottery_results_user_id_idx on public.lottery_results (user_id);
create index lottery_results_user_result_idx on public.lottery_results (user_id, result);

create trigger lottery_results_set_updated_at
  before update on public.lottery_results
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- expenses
-- ---------------------------------------------------------------------------
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  oshi_id uuid references public.oshis (id) on delete set null,
  category public.expense_category not null default 'other',
  amount integer not null check (amount > 0),
  spent_at date not null,
  title text not null,
  linked_lottery_result_id uuid references public.lottery_results (id) on delete set null,
  payment_method text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index expenses_user_id_idx on public.expenses (user_id);
create index expenses_user_spent_at_idx on public.expenses (user_id, spent_at desc);

create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- reminders
-- ---------------------------------------------------------------------------
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_type public.reminder_target_type not null,
  target_id uuid not null,
  remind_at timestamptz not null,
  channel public.reminder_channel not null default 'in_app',
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index reminders_user_pending_idx
  on public.reminders (user_id, remind_at)
  where sent_at is null;

create trigger reminders_set_updated_at
  before update on public.reminders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- subscriptions (Stripe future)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- View: upcoming_deadlines (7 days)
-- ---------------------------------------------------------------------------
create or replace view public.upcoming_deadlines as
select
  r.user_id,
  'reservation'::text as source_type,
  r.id as source_id,
  r.title,
  r.deadline_at
from public.reservations r
where
  r.deadline_at is not null
  and r.deadline_at >= timezone('utc', now())
  and r.deadline_at < timezone('utc', now()) + interval '7 days'
  and r.status not in ('picked_up', 'cancelled')

union all

select
  e.user_id,
  'event_application'::text,
  e.id,
  e.title,
  coalesce(e.result_announce_at, e.application_deadline_at)
from public.event_applications e
where
  coalesce(e.result_announce_at, e.application_deadline_at) is not null
  and coalesce(e.result_announce_at, e.application_deadline_at) >= timezone('utc', now())
  and coalesce(e.result_announce_at, e.application_deadline_at) < timezone('utc', now()) + interval '7 days'
  and e.status not in ('done', 'cancelled');

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.oshis enable row level security;
alter table public.reservations enable row level security;
alter table public.event_applications enable row level security;
alter table public.lottery_results enable row level security;
alter table public.expenses enable row level security;
alter table public.reminders enable row level security;
alter table public.subscriptions enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- oshis
create policy "oshis_all_own" on public.oshis
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reservations
create policy "reservations_all_own" on public.reservations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- event_applications
create policy "event_applications_all_own" on public.event_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lottery_results
create policy "lottery_results_all_own" on public.lottery_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- expenses
create policy "expenses_all_own" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reminders
create policy "reminders_all_own" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- subscriptions
create policy "subscriptions_all_own" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- View inherits underlying table RLS when security_invoker is used (PG15+)
alter view public.upcoming_deadlines set (security_invoker = true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.upcoming_deadlines to authenticated;
