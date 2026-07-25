# SecondTrack

SecondTrack is a public read-only demo for tracking second-hand clothing inventory, expenses, sales, and profit analytics. A pre-created owner account can sign in to manage data.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- Supabase Database and Storage
- TanStack Query
- Recharts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local `.env` file and add the required Supabase variables:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=your-storage-bucket
```

3. Create the storage bucket specified in `VITE_SUPABASE_STORAGE_BUCKET`.

4. Run the SQL from `supabase/schema.sql` for a fresh project. For the existing project, apply the files from `supabase/migrations` in timestamp order.

5. Start the app:

```bash
npm run dev
```

## Access Model

- Visitors can browse the dashboard, items, expenses, sales, monthly analytics, and photos without signing in.
- Only an authenticated owner can create, update, or delete data.
- Public registration is intentionally not available in the application.
- Owner credentials are created and managed in Supabase Auth, never in this repository.

The frontend uses only the Supabase publishable/anon key. Write protection is enforced by Row Level Security after the included migration is applied.
