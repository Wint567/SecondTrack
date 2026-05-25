create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text,
  category text,
  size text,
  condition text,
  purchase_date date not null,
  purchase_price numeric(10, 2) not null default 0,
  planned_sale_price numeric(10, 2),
  actual_sale_price numeric(10, 2),
  sold_at timestamptz,
  status text not null default 'Куплено' check (status in ('Куплено', 'Подготовлено', 'Выставлено', 'Продано', 'Не продано', 'Утеряно')),
  source_place text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.items(id) on delete set null,
  type text not null,
  amount numeric(10, 2) not null default 0,
  expense_date date not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.expenses
alter column item_id drop not null;

alter table public.items drop column if exists user_id;
alter table public.expenses drop column if exists user_id;
alter table public.items drop constraint if exists items_status_check;

update public.items
set status = case status
  when 'bought' then 'Куплено'
  when 'prepared' then 'Подготовлено'
  when 'listed' then 'Выставлено'
  when 'sold' then 'Продано'
  when 'unsold' then 'Не продано'
  when 'lost' then 'Утеряно'
  else status
end
where status in ('bought', 'prepared', 'listed', 'sold', 'unsold', 'lost');

alter table public.items
alter column status set default 'Куплено';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'items_status_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
    add constraint items_status_check
    check (status in ('Куплено', 'Подготовлено', 'Выставлено', 'Продано', 'Не продано', 'Утеряно'));
  end if;
end $$;

alter table public.items enable row level security;
alter table public.item_photos enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "Public can read items" on public.items;
create policy "Public can read items"
on public.items
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert items" on public.items;
create policy "Public can insert items"
on public.items
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update items" on public.items;
create policy "Public can update items"
on public.items
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete items" on public.items;
create policy "Public can delete items"
on public.items
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can read item photos" on public.item_photos;
create policy "Public can read item photos"
on public.item_photos
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert item photos" on public.item_photos;
create policy "Public can insert item photos"
on public.item_photos
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update item photos" on public.item_photos;
create policy "Public can update item photos"
on public.item_photos
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete item photos" on public.item_photos;
create policy "Public can delete item photos"
on public.item_photos
for delete
to anon, authenticated
using (true);

drop policy if exists "Public can read expenses" on public.expenses;
create policy "Public can read expenses"
on public.expenses
for select
to anon, authenticated
using (true);

drop policy if exists "Public can insert expenses" on public.expenses;
create policy "Public can insert expenses"
on public.expenses
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can update expenses" on public.expenses;
create policy "Public can update expenses"
on public.expenses
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public can delete expenses" on public.expenses;
create policy "Public can delete expenses"
on public.expenses
for delete
to anon, authenticated
using (true);

create or replace view public.item_profit_view as
select
  i.*,
  coalesce(sum(e.amount), 0) as total_expenses,
  coalesce(i.actual_sale_price, 0) - coalesce(i.purchase_price, 0) - coalesce(sum(e.amount), 0) as profit
from public.items i
left join public.expenses e on e.item_id = i.id
group by i.id;

insert into storage.buckets (id, name, public)
values ('item-photos', 'item-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can upload item photos" on storage.objects;
create policy "Public can upload item photos"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'item-photos');

drop policy if exists "Public can view item photos in storage" on storage.objects;
create policy "Public can view item photos in storage"
on storage.objects
for select
to public
using (bucket_id = 'item-photos');

drop policy if exists "Public can update item photos in storage" on storage.objects;
create policy "Public can update item photos in storage"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'item-photos')
with check (bucket_id = 'item-photos');

drop policy if exists "Public can delete item photos in storage" on storage.objects;
create policy "Public can delete item photos in storage"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'item-photos');
