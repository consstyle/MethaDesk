-- Enable RLS
alter table public.projekte enable row level security;

-- Create projekte table
create table if not exists public.projekte (
  id uuid default gen_random_uuid() primary key,
  projektnummer text not null,
  projektname text not null,
  strasse text,
  plz text,
  ort text,
  kanton text,
  projektleiter text,
  bauleiter text,
  polier text,
  bim_konstrukteur text,
  deviseur text,
  einkauf text,
  status text check (status in ('offen', 'in arbeit', 'abgeschlossen', 'pausiert')) default 'offen',
  "imageUrl" text,
  "createdBy" uuid references auth.users(id),
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for projekte
create policy "Public read access"
  on public.projekte for select
  using ( true );

create policy "Authenticated create access"
  on public.projekte for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated update access"
  on public.projekte for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated delete access"
  on public.projekte for delete
  using ( auth.role() = 'authenticated' );

-- Create Storage Bucket for Project Images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'project-images' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated Update"
  on storage.objects for update
  with check ( bucket_id = 'project-images' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'project-images' and auth.role() = 'authenticated' );
