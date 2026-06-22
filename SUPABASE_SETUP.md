# Podscars Supabase Setup

This app is designed to use Supabase as its live database for categories, finalists, nominations, votes, admin settings, and authentication.

## 1. Create your Supabase project

Create or open the Supabase project you want the site to use.

## 2. Run the schema

Open the SQL editor in Supabase and run:

- [supabase/schema.sql](/Users/mildsdixon/Documents/AI%20New/projects/podscars/supabase/schema.sql)

That creates:

- `profiles`
- `categories`
- `finalists`
- `nominations`
- `votes`
- `admin_settings`

## 3. Add environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4. Seed content

Add your live content to:

- `categories`
- `finalists`

To seed the current Podscars podcast nomination categories, run:

- [supabase/seed-categories.sql](/Users/mildsdixon/Documents/AI%20New/projects/podscars/supabase/seed-categories.sql)

Suggested category columns:

- `id`
- `title`
- `type`
- `description`
- `nomination_prompt`
- `active`
- `sort_order`

Suggested finalist columns:

- `category_id`
- `name`
- `subtitle`
- `active`
- `sort_order`

## 5. Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

## 6. Create your first admin

Sign up through `/login`, then in the Supabase table editor set `profiles.is_admin = true` for that user.
That user will then be able to access `/admin`.

## Behavior

- `/api/nominations` writes to `nominations`
- `/api/votes` upserts one vote per email per category in `votes`
- `/login` and `/auth/callback` use Supabase Auth
- `/admin` is protected by Supabase Auth plus `profiles.is_admin`
- `/planning` and the homepage read live totals from Supabase
