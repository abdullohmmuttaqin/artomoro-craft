alter table public.produk
  add column if not exists is_active boolean not null default true;

create index if not exists produk_is_active_idx on public.produk (is_active);
