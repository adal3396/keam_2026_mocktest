# KEAM Mock Test (Supabase + Vite + React)

This project is a KEAM-style mock examination app with:
- Candidate registration
- 150-question exam flow (Math/Physics/Chemistry)
- Timer + autosave
- Submission + scoring (+4 / -1)
- Result summary

## 1) Supabase Setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Go to **Project Settings -> API** and copy:
   - Project URL
   - Publishable (anon) key

## 2) Local Run

1. Create `.env` in project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_publishable_key
```

2. Install and run:

```bash
npm install
npm run dev
```

## 3) Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/).
3. Framework preset: **Vite**.
4. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

No backend server is required for deployment in the current architecture.

## 4) Security Note (Important)

Current SQL enables broad anon access for fast setup/testing.  
Before real public launch, restrict RLS policies to authenticated users and controlled operations.
