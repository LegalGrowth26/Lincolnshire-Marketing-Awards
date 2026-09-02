-- Comped bookings are stored as paid orders with amount_total = 0 and no
-- stripe_session_id — a combination a real Stripe sale can never produce.
-- They must count toward seats sold and every catering number (they already
-- do: those all key on status = 'paid'), and they add nothing to revenue
-- (gross_pence sums amount_total). The one wrinkle is the per-type order
-- counts, which would count a comped booking as a paid single: exclude
-- comped from those and surface the comped seat count separately.
--
-- Run in the Neon SQL editor, after 0003.

create or replace view v_seat_summary as
select
  (count(*) filter (where o.ticket_type = 'single'
                      and not (coalesce(o.amount_total, 0) = 0
                               and o.stripe_session_id is null)))::int as single_orders,
  (count(*) filter (where o.ticket_type = 'table8'
                      and not (coalesce(o.amount_total, 0) = 0
                               and o.stripe_session_id is null)))::int as table_orders,
  coalesce(sum(o.seats), 0)::int                                       as seats_sold,
  coalesce(sum(o.amount_total), 0)::int                                as gross_pence,
  (count(*) filter (where o.details_completed_at is not null))::int    as orders_complete,
  (count(*) filter (where o.details_completed_at is null))::int        as orders_outstanding,
  coalesce(sum(o.seats) filter (where coalesce(o.amount_total, 0) = 0
                                  and o.stripe_session_id is null), 0)::int as comped_seats
from orders o
where o.status = 'paid';
