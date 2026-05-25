# SecondTrack

SecondTrack is a production-style MVP for tracking second-hand clothing inventory, expenses, sales, and profit analytics.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- Supabase Auth, Database, and Storage
- TanStack Query
- Recharts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in your Supabase project credentials and create the storage bucket specified in `VITE_SUPABASE_STORAGE_BUCKET`.

4. Run the SQL from [supabase/schema.sql](/c:/Users/baski/OneDrive/Desktop/SecondTrack/supabase/schema.sql:1) in your Supabase SQL editor.

5. Start the app:

```bash
npm run dev
```

## Auth

The app includes a lightweight email/password auth flow for a single-user setup. Create your first user in Supabase Auth or sign up from the app if email/password signups are enabled.
