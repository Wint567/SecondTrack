# SecondTrack

SecondTrack is a demo-mode MVP for tracking second-hand clothing inventory, expenses, sales, and profit analytics.

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

4. Run the SQL from `supabase/schema.sql` in your Supabase SQL editor.

5. Start the app:

```bash
npm run dev
```

## Demo Mode

The app currently runs without registration or login. It is intended as a demo-mode single workspace while the product is being developed.

Full authentication is not enabled yet. Later, when the project is published as a pet project, the plan is to add authentication and a public read-only viewing mode so visitors can inspect demo data without being able to edit it.
