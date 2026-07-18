create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  title text not null,
  type text not null check (type in ('person', 'podcast', 'movie')),
  description text,
  nomination_prompt text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.finalists (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.categories(id) on delete cascade,
  name text not null,
  subtitle text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.nominations (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  category_title text not null,
  nominee_name text not null,
  project_title text not null,
  reference_link text,
  reason text not null,
  submitted_by text not null,
  submitter_email text not null,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'New',
  submitted_at timestamptz not null default now()
);

create unique index if not exists nominations_unique_submitter_per_category
on public.nominations (category_id, lower(submitter_email));

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  category_title text not null,
  nominee_name text not null,
  voter_name text not null,
  voter_email text not null,
  award_year integer not null default extract(year from now())::integer,
  user_id uuid references public.profiles(id) on delete set null,
  submitted_at timestamptz not null default now(),
  constraint votes_unique_voter_per_category_year unique (category_id, voter_email, award_year)
);

create table if not exists public.admin_settings (
  id integer primary key,
  nominations_open boolean not null default true,
  voting_open boolean not null default true,
  nominations_message text not null default 'Nominations are temporarily closed. Please check back soon.',
  voting_message text not null default 'Voting is temporarily closed. Please check back soon.',
  homepage_flow_eyebrow text not null default 'How It Works',
  homepage_flow_title text not null default 'Simple flow',
  homepage_flow_summary text not null default 'Nominate, shortlist, vote, announce.',
  hero_banner_image_url text not null default '/podscars-social-mockups/podscars-landscape-ad-1200x628.png',
  hero_banner_alt_text text not null default 'Podscars homepage banner',
  updated_at timestamptz not null default now(),
  constraint admin_settings_singleton check (id = 1)
);

create table if not exists public.ad_spots (
  id integer primary key,
  slot integer not null unique check (slot between 1 and 5),
  image_url text not null,
  alt_text text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (id)
values (1)
on conflict (id) do nothing;

insert into public.ad_spots (id, slot, image_url, alt_text, active)
select
  slot,
  slot,
  '/podscars-social-mockups/podscars-landscape-ad-1200x628.png',
  'Podscars advertising spot ' || slot,
  true
from generate_series(1, 5) as slot
on conflict (id) do nothing;

grant usage on schema public to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.finalists to anon, authenticated;
grant select, insert on public.nominations to anon, authenticated;
grant select, insert, update on public.votes to anon, authenticated;
grant select, update on public.admin_settings to anon, authenticated;
grant select on public.ad_spots to anon, authenticated;
grant select, insert, update on public.ad_spots to service_role;
grant select, update on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ad_spots enable row level security;

create policy "Anyone can read active ad spots"
on public.ad_spots
for select
to anon, authenticated
using (active = true);

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
