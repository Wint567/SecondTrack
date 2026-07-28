begin;

alter table public.items
add column if not exists public_description text,
add column if not exists is_public boolean not null default false,
add column if not exists slug text,
add column if not exists vinted_url text,
add column if not exists primary_photo_id uuid;

alter table public.items
alter column is_public set default false;

update public.items
set is_public = false
where is_public is null;

alter table public.items
alter column is_public set not null;

create unique index if not exists items_slug_unique_nonempty
on public.items (slug)
where slug is not null and btrim(slug) <> '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'items_slug_format_check'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
    add constraint items_slug_format_check
    check (slug is null or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'items_primary_photo_id_fkey'
      and conrelid = 'public.items'::regclass
  ) then
    alter table public.items
    add constraint items_primary_photo_id_fkey
    foreign key (primary_photo_id)
    references public.item_photos(id)
    on delete set null;
  end if;
end $$;

do $$
declare
  unsupported_statuses text;
begin
  select string_agg(quote_literal(status), ', ' order by quote_literal(status))
  into unsupported_statuses
  from (
    select distinct status
    from public.items
    where status not in ('Куплено', 'Выставлено', 'Продано', 'Утеряно')
  ) as unsupported;

  if unsupported_statuses is not null then
    raise exception
      'Cannot replace items_status_check. Unsupported statuses found: %',
      unsupported_statuses;
  end if;
end $$;

alter table public.items
drop constraint if exists items_status_check;

alter table public.items
add constraint items_status_check
check (status in ('Куплено', 'Выставлено', 'Продано', 'Утеряно'));

create or replace view public.public_store_items
with (security_invoker = true, security_barrier = true)
as
select
  id,
  slug,
  title,
  brand,
  category,
  size,
  condition,
  public_description,
  planned_sale_price,
  status,
  vinted_url,
  primary_photo_id,
  created_at
from public.items
where is_public = true
  and status in ('Куплено', 'Выставлено');

comment on view public.public_store_items is
'Public store projection without internal accounting fields.';

revoke all on public.public_store_items from public, anon, authenticated;
grant select on public.public_store_items to anon, authenticated;

commit;
