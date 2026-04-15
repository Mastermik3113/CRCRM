# Supabase Setup — CR-Car Rental project

Fresh-start setup for connecting this CRM to your **CR-Car Rental** Supabase project.
Takes ~5 minutes. No demo data is loaded — you'll add records through the UI.

---

## 1. Run the SQL migrations

In the Supabase dashboard for **CR-Car Rental**:

1. Open **SQL Editor** → **New query**
2. Run these files in order (paste each, hit Run, repeat):

   | Order | File                                             | What it does                              |
   | ----- | ------------------------------------------------ | ------------------------------------------ |
   | 1     | `supabase/migrations/00001_initial_schema.sql`   | Tables, enums, indexes, triggers           |
   | 2     | `supabase/migrations/00002_storage_buckets.sql`  | Storage buckets + storage policies         |
   | 3     | `supabase/migrations/00003_backoffice_recurring.sql` | Recurring expenses table + extended categories |
   | 4     | `supabase/migrations/00004_rls_policies.sql`     | Row Level Security for authenticated users |

   Do **not** run `supabase/seed.sql` — it's there for reference only. The app
   starts empty on purpose.

## 2. Create the admin user

In the Supabase dashboard:

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `yarden@crcarrental.local` (or any email you prefer)
3. Password: `Yarden322`
4. Check **Auto Confirm User** so you can sign in right away
5. Click **Create user**

> Note: Supabase Auth requires an email. Pick anything — you'll sign in with it.

## 3. Wire the env vars

In the Supabase dashboard:

1. **Project Settings** → **API**
2. Copy **Project URL** and **anon public** key
3. Edit `.env.local` in the repo root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

4. Restart the dev server (`Ctrl+C` then `npm run dev`).

## 4. Sign in

Go to `http://localhost:3000/login`, enter the email + password from step 2.

---

## What's wired to Supabase today

- **Auth**: login, logout, session persistence, password change (Settings → Security)
- **Schema**: all tables + RLS policies live in your project

## What still uses in-memory state (next session)

- Vehicles / Clients / Rentals / Payments / Service Logs / Back-office expenses
  CRUD dialogs write to local component state for now. Data resets on refresh.
  Wiring these to Supabase is the next step — ask when you're ready.
