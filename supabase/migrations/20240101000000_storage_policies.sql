-- Enable Storage by default for authenticated users
create policy "Enable storage for authenticated users"
on storage.buckets
for all
to authenticated
using (true);

-- Enable object operations for authenticated users
create policy "Enable object operations for authenticated users"
on storage.objects
for all
to authenticated
using (true);

-- Grant usage on storage schema
grant usage on schema storage to authenticated;

-- Grant all on buckets to authenticated users
grant all on storage.buckets to authenticated;

-- Grant all on objects to authenticated users
grant all on storage.objects to authenticated;
