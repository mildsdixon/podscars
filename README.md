# Podscars

A Next.js site for Podscars nominations, finalists, public voting, and live reporting backed by Supabase.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add your Supabase project URL, publishable or anon key, and service role key.
3. Run the SQL in [supabase/schema.sql](/Users/mildsdixon/Documents/AI%20New/projects/podscars/supabase/schema.sql) against your Supabase database.
4. Start the app with `npm run dev`.

## Live features

- Categories and finalists loaded from Supabase
- Nominations and votes stored in Supabase
- Organizer dashboard at `/planning`
- Admin dashboard at `/admin`
- Sign-in page at `/login`
- Read APIs at `/api/nominations` and `/api/votes`

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Notes

- The app uses the service role key only on the server.
- Admin access is controlled through Supabase Auth plus the `profiles.is_admin` flag.
- Public forms and dashboard reads will return setup errors until Supabase is configured and the schema is installed.
- The included `vercel.json` still uses `npm install --legacy-peer-deps` during deployment because of the starter dependency graph.
