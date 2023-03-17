create or replace function price_over_time_by_rooms(property_place text, room_sizes float[], area_from int, area_to int) -- 1
returns table (rooms float, average_price int, data_timestamp text)
language sql -- 3
as $$  -- 4
  select property.rooms, avg(price_chf)::int as average_price, timestamp as data_timestamp from price_over_time
  join property on property_id=property.id
  where area between area_from and area_to and place = property_place and rooms = any(room_sizes)
  group by property.rooms, timestamp
  order by rooms desc
$$; --6

-- 17.03.2023
create or replace function price_over_time_by_rooms(property_place text, room_sizes float[], area_from int, area_to int, from_time text, to_time text) -- 1
returns table (rooms float, average_price int, data_timestamp text, property_count int)
language sql -- 3
as $$  -- 4
  select property.rooms, avg(price_chf)::int as average_price, timestamp as data_timestamp, count(property.id) as property_count  from price_over_time
  join property on property_id=property.id
  where area between area_from and area_to and place = property_place and rooms = any(room_sizes) and timestamp between from_time and to_time
  group by property.rooms, timestamp
  order by rooms desc
$$; --6


select * from price_over_time_by_rooms('bern', '{1.5}', 0, 500)
