-- Cast every count() and sum() in the dashboard views to int.
-- Postgres returns these as bigint, which the Neon serverless driver hands to
-- JavaScript as strings ("39" + "0" concatenates to "390"). The call sites
-- also coerce with Number(), so either fix alone is enough — this makes the
-- views correct at the source.
--
-- Run in the Neon SQL editor. v_pending_orders (from 0002) selects plain
-- order columns with no aggregates, so it needs no change.

create or replace view v_seat_summary as
select
  (count(*) filter (where o.ticket_type = 'single'))::int            as single_orders,
  (count(*) filter (where o.ticket_type = 'table8'))::int            as table_orders,
  coalesce(sum(o.seats), 0)::int                                     as seats_sold,
  coalesce(sum(o.amount_total), 0)::int                              as gross_pence,
  (count(*) filter (where o.details_completed_at is not null))::int  as orders_complete,
  (count(*) filter (where o.details_completed_at is null))::int      as orders_outstanding
from orders o
where o.status = 'paid';

create or replace view v_guest_completion as
select
  count(*)::int                                         as seats_total,
  (count(*) filter (where g.full_name is not null
                      and length(trim(g.full_name)) > 0))::int as seats_named,
  (count(*) filter (where g.full_name is null
                      or length(trim(g.full_name)) = 0))::int  as seats_unnamed
from guests g
join orders o on o.id = g.order_id and o.status = 'paid';

create or replace view v_dietary_counts as
select
  d.slug,
  d.label,
  d.sort_order,
  count(g.id)::int as guest_count
from dietary_options d
left join guests g
       on d.slug = any (g.dietary_tags)
left join orders o
       on o.id = g.order_id and o.status = 'paid'
where d.active
group by d.slug, d.label, d.sort_order
order by d.sort_order;

-- v_shortlist_status: the lateral aggregates surface as seats_booked.
-- Recreated in full so the exposed columns keep their order; still no join
-- to shortlist_results, per docs/CONFIDENTIAL.md.
create or replace view v_shortlist_status as
select
  s.id,
  s.category_id,
  c.title              as category_title,
  s.company_name,
  s.contact_name,
  s.email,
  s.is_shortlisted,
  s.invite_state,
  s.invited_at,
  s.reminder_count,
  coalesce(b.orders_count, 0) > 0        as has_booked,
  coalesce(b.seats, 0)::int              as seats_booked,
  b.first_order_at
from shortlist s
join categories c on c.id = s.category_id
left join lateral (
  select count(*) as orders_count,
         sum(o.seats) as seats,
         min(o.created_at) as first_order_at
  from orders o
  where o.status = 'paid'
    and (o.shortlist_id = s.id or lower(o.buyer_email) = lower(s.email))
) b on true;
