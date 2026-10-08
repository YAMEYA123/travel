-- Run once in Supabase SQL Editor for projects where shared_expenses returns
-- "permission denied for table shared_expenses" (42501).
-- RLS remains enabled and continues to restrict rows to trip members.
grant select, insert, update, delete on table public.shared_expenses to authenticated;
drop policy if exists "owners update expenses" on public.shared_expenses;
drop policy if exists "members update expenses" on public.shared_expenses;
create policy "members update expenses" on public.shared_expenses
  for update to authenticated
  using (public.is_trip_member(trip_id))
  with check (public.is_trip_member(trip_id));
