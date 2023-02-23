create or replace function get_room_sizes() -- 1
returns table (rooms float)
language sql -- 3
as $$  -- 4
  select rooms from property
  group by rooms
  order by rooms asc
$$; --6
