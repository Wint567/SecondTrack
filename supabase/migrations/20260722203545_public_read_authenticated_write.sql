begin;

-- Public visitors keep read-only access to the application data.
-- Only authenticated users can create, update, or delete records.
alter table public.items enable row level security;
alter table public.expenses enable row level security;
alter table public.item_photos enable row level security;

-- Items: readable by everyone, writable only by an authenticated user.
drop policy if exists "Allow select for all" on public.items;
drop policy if exists "Allow insert for all" on public.items;
drop policy if exists "Allow update for all" on public.items;
drop policy if exists "Allow delete for all" on public.items;
drop policy if exists "Public can read items" on public.items;
drop policy if exists "Public can insert items" on public.items;
drop policy if exists "Public can update items" on public.items;
drop policy if exists "Public can delete items" on public.items;
drop policy if exists "Anyone can read items" on public.items;
drop policy if exists "Authenticated can create items" on public.items;
drop policy if exists "Authenticated can update items" on public.items;
drop policy if exists "Authenticated can delete items" on public.items;

create policy "Anyone can read items"
on public.items
for select
to anon, authenticated
using (true);

create policy "Authenticated can create items"
on public.items
for insert
to authenticated
with check (true);

create policy "Authenticated can update items"
on public.items
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete items"
on public.items
for delete
to authenticated
using (true);

-- Expenses: public history remains visible; mutations require an authenticated user.
drop policy if exists "Allow select for all expenses" on public.expenses;
drop policy if exists "Allow insert for all expenses" on public.expenses;
drop policy if exists "Allow update for all expenses" on public.expenses;
drop policy if exists "Allow delete for all expenses" on public.expenses;
drop policy if exists "Public can read expenses" on public.expenses;
drop policy if exists "Public can insert expenses" on public.expenses;
drop policy if exists "Public can update expenses" on public.expenses;
drop policy if exists "Public can delete expenses" on public.expenses;
drop policy if exists "Anyone can read expenses" on public.expenses;
drop policy if exists "Authenticated can create expenses" on public.expenses;
drop policy if exists "Authenticated can update expenses" on public.expenses;
drop policy if exists "Authenticated can delete expenses" on public.expenses;

create policy "Anyone can read expenses"
on public.expenses
for select
to anon, authenticated
using (true);

create policy "Authenticated can create expenses"
on public.expenses
for insert
to authenticated
with check (true);

create policy "Authenticated can update expenses"
on public.expenses
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete expenses"
on public.expenses
for delete
to authenticated
using (true);

-- Photo metadata follows the same public-read/authenticated-write model.
drop policy if exists "Allow select for all item_photos" on public.item_photos;
drop policy if exists "Allow insert for all item_photos" on public.item_photos;
drop policy if exists "Allow update for all item_photos" on public.item_photos;
drop policy if exists "Allow delete for all item_photos" on public.item_photos;
drop policy if exists "Public can read item photos" on public.item_photos;
drop policy if exists "Public can insert item photos" on public.item_photos;
drop policy if exists "Public can update item photos" on public.item_photos;
drop policy if exists "Public can delete item photos" on public.item_photos;
drop policy if exists "Anyone can read item photos" on public.item_photos;
drop policy if exists "Authenticated can create item photos" on public.item_photos;
drop policy if exists "Authenticated can update item photos" on public.item_photos;
drop policy if exists "Authenticated can delete item photos" on public.item_photos;

create policy "Anyone can read item photos"
on public.item_photos
for select
to anon, authenticated
using (true);

create policy "Authenticated can create item photos"
on public.item_photos
for insert
to authenticated
with check (true);

create policy "Authenticated can update item photos"
on public.item_photos
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete item photos"
on public.item_photos
for delete
to authenticated
using (true);

-- The item-photos bucket stays publicly readable because existing records use public URLs.
-- Uploading, replacing, and deleting objects requires an authenticated session.
drop policy if exists "Allow select for item-photos" on storage.objects;
drop policy if exists "Allow insert for item-photos" on storage.objects;
drop policy if exists "Allow update for item-photos" on storage.objects;
drop policy if exists "Allow delete for item-photos" on storage.objects;
drop policy if exists "Public can upload item photos" on storage.objects;
drop policy if exists "Public can view item photos in storage" on storage.objects;
drop policy if exists "Public can update item photos in storage" on storage.objects;
drop policy if exists "Public can delete item photos in storage" on storage.objects;
drop policy if exists "Anyone can view item photos in storage" on storage.objects;
drop policy if exists "Authenticated can upload item photos" on storage.objects;
drop policy if exists "Authenticated can update item photos" on storage.objects;
drop policy if exists "Authenticated can delete item photos" on storage.objects;
drop policy if exists "Authenticated can update item photos in storage" on storage.objects;
drop policy if exists "Authenticated can delete item photos in storage" on storage.objects;

create policy "Anyone can view item photos in storage"
on storage.objects
for select
to public
using (bucket_id = 'item-photos');

create policy "Authenticated can upload item photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'item-photos');

create policy "Authenticated can update item photos in storage"
on storage.objects
for update
to authenticated
using (bucket_id = 'item-photos')
with check (bucket_id = 'item-photos');

create policy "Authenticated can delete item photos in storage"
on storage.objects
for delete
to authenticated
using (bucket_id = 'item-photos');

commit;
