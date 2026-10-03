# SecondTrack — Inventory & Sales Dashboard

A React application for managing second-hand clothing inventory, recording expenses and sales, and reviewing profit and cashflow. It connects to Supabase for data, authentication and photo storage.

**[Live demo](https://second-track.vercel.app)** · **[Companion storefront](https://github.com/Wint567/SecondTrackShop)**

The demo is open for browsing without an account. Administrative actions require a Supabase Auth session. The interface is in Russian and displays amounts in PLN.

## Explore the project

| Screen | What to try |
| --- | --- |
| [Dashboard](https://second-track.vercel.app/dashboard) | Summary metrics, monthly trends and inventory status charts |
| [Inventory](https://second-track.vercel.app/items) | Filter by status, brand, category and purchase date |
| [Expenses](https://second-track.vercel.app/expenses) | Review general expenses and costs linked to individual items |
| [Sales](https://second-track.vercel.app/sales) | Review sold items and their profit |
| [Monthly analytics](https://second-track.vercel.app/monthly) | Navigate between months and inspect purchases, sales and cashflow |

## Features

- Inventory records with product details, purchase and sale prices, dates and lifecycle status.
- Item creation, editing and deletion for authenticated users, with form validation and error feedback.
- Photo uploads to Supabase Storage, primary photo selection and recovery messages for partially completed operations.
- Publication controls, product slugs and optional Vinted links for the companion storefront.
- TanStack Query hooks for fetching, caching and refreshing data after mutations.
- Recharts dashboards, monthly summaries and separate calculations for cashflow and profit on sold items.
- Responsive navigation, desktop tables, mobile cards, and loading, empty and error states.

## Stack

| Area | Tools |
| --- | --- |
| Interface | React 18, JavaScript, React Router 6, Tailwind CSS 3 |
| Data fetching | TanStack Query 5 |
| Backend services | Supabase Postgres, Auth and Storage |
| Charts and dates | Recharts, date-fns |
| Tooling and hosting | Vite 5, npm, Vercel |

## Relationship to SecondTrackShop

[SecondTrackShop](https://github.com/Wint567/SecondTrackShop) is the customer-facing Next.js storefront. SecondTrack manages the inventory that the storefront displays.

```text
SecondTrack management UI
          |
          v
Supabase: items + item_photos + expenses
          |
          v
public_store_items view
          |
          v
SecondTrackShop storefront
```

The `public_store_items` view selects published items in the purchased or listed state and omits internal accounting fields. Publication requires product details, a price, a description and at least one photo. The management demo itself still allows public reading of inventory and expense records; the storefront view does not make the underlying demo data private.

## Run locally

You need Node.js, npm and a Supabase project.

```bash
git clone https://github.com/Wint567/SecondTrack.git
cd SecondTrack
npm ci
```

Copy `.env.example` to `.env` and fill in your own project values:

```dotenv
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_SUPABASE_STORAGE_BUCKET=item-photos
```

`VITE_` values are included in the browser build. Use the publishable/anon key here; keep service-role keys and account credentials out of the frontend and repository.

### Database and authentication

1. For a fresh Supabase project, run `supabase/schema.sql` in the SQL editor. It defines tables, views, row-level policies and the `item-photos` bucket.
2. For an existing compatible installation, review and apply `supabase/migrations/` in timestamp order. Review SQL against your current schema before applying it to existing data.
3. Keep the `item-photos` bucket name unless you also update the matching Storage policies.
4. To enable management access, create the intended administrator account in Supabase Auth. Keep public sign-ups disabled for this access model.

Start the application:

```bash
npm run dev
```

Open [localhost:5173](http://localhost:5173). A new database starts empty; sign in with your own administrator account to add records.

## Access model

- Anonymous visitors can read items, expenses, photo metadata and public photo URLs.
- Included row-level policies allow writes to authenticated users. They do not check a separate owner ID or administrator role.
- The intended setup has only trusted administrator accounts in Supabase Auth. Hiding registration in the UI alone does not restrict account creation at the service level.
- This is a public portfolio demo with one shared dataset. Private business data or separate customer workspaces require a different authorization model.

## Project structure

```text
src/
  app/         Router and QueryClient configuration
  auth/        Session provider and protected routes
  api/         Item, photo and authentication operations
  hooks/       Query hooks, mutations, filters and dashboard metrics
  pages/       Dashboard, inventory, expenses, sales, monthly view and login
  components/  Forms, charts, tables, navigation and feedback
  services/    Supabase client and environment configuration
  utils/       Validation, normalization, slugs and calculations
supabase/
  schema.sql   Fresh-project database setup
  migrations/  Changes for existing installations
```

## Build and deploy

```bash
npm run build
npm run preview
```

Vite writes the production build to `dist/`. On Vercel, use the Vite preset, build command `npm run build` and output directory `dist`. Set the same environment variables before building. `vercel.json` contains the SPA fallback needed for direct navigation to application routes.

## Current scope

The app uses real Supabase services and requires configuration; it has no bundled offline fixture mode. The repository currently has no automated test suite or lint command. Public demo browsing and a production build were checked during the portfolio review; authenticated writes and deployed database policies were not tested against the live dataset.
