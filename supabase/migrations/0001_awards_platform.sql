-- Lincolnshire Marketing Awards: tickets, guests, dietaries, shortlist automation
-- Run in the Supabase SQL Editor. Idempotent where practical.
--
-- CONFIDENTIALITY NOTE
-- Scores, winner and highly commended live ONLY in shortlist_results.
-- That table is never selected by any public route, view, or email template.
-- Every table below is RLS-enabled with no policies, so the anon key can read
-- nothing. All access is server-side via the service role key.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

create table if not exists categories (
  id          smallint primary key,
  slug        text not null unique,
  title       text not null,
  sort_order  smallint not null default 0
);

insert into categories (id, slug, title, sort_order) values
  (1,  'business-growth',            'Business Growth Award',                    1),
  (2,  'start-up',                   'Start-Up / New Business of the Year',      2),
  (3,  'scale-up',                   'Scale-Up Business of the Year',            3),
  (4,  'breakthrough',               'Breakthrough Business of the Year',        4),
  (5,  'entrepreneur',               'Entrepreneur of the Year',                 5),
  (6,  'employer',                   'Employer of the Year',                     6),
  (7,  'rising-star',                'Rising Star Award',                        7),
  (8,  'community-impact',           'Community Impact Award',                   8),
  (9,  'marketing-campaign',         'Marketing Campaign of the Year',           9),
  (10, 'social-media-growth',        'Best Use of Social Media for Growth',      10),
  (11, 'brand-growth',               'Brand Growth Award',                       11),
  (12, 'customer-experience',        'Customer Experience Award',                12),
  (13, 'customer-growth',            'Customer Growth Award',                    13),
  (14, 'professional-services',      'Professional Services Growth Award',       14),
  (15, 'business-recognition',       'Business Recognition Award Nomination',    15)
on conflict (id) do update set title = excluded.title, slug = excluded.slug;

create table if not exists dietary_options (
  slug        text primary key,
  label       text not null,
  sort_order  smallint not null default 0,
  active      boolean not null default true
);

insert into dietary_options (slug, label, sort_order) values
  ('none',              'No requirements',        1),
  ('vegetarian',        'Vegetarian',             2),
  ('vegan',             'Vegan',                  3),
  ('pescatarian',       'Pescatarian',            4),
  ('gluten_free',       'Gluten free',            5),
  ('dairy_free',        'Dairy free',             6),
  ('nut_allergy',       'Nut allergy',            7),
  ('shellfish_allergy', 'Shellfish allergy',      8),
  ('halal',             'Halal',                  9),
  ('kosher',            'Kosher',                10),
  ('other',             'Other (please specify)',11)
on conflict (slug) do update set label = excluded.label;

-- Event configuration and automation switches, editable from the dashboard.
create table if not exists settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

insert into settings (key, value) values
  ('event_date',              '"2026-09-10"'::jsonb),
  ('venue',                   '"DoubleTree by Hilton, Lincoln"'::jsonb),
  ('arrival_time',            '"7:00pm"'::jsonb),
  ('dress_code',              '"Black tie"'::jsonb),
  ('capacity_seats',          '200'::jsonb),
  ('automation_enabled',      'false'::jsonb),
  ('invite_reminder_days',    '[5, 12, 21]'::jsonb),
  ('details_chase_days',      '[3, 10, 21]'::jsonb),
  ('plan_email_days_before',  '7'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Shortlist
-- ---------------------------------------------------------------------------

create table if not exists shortlist (
  id             uuid primary key default gen_random_uuid(),
  category_id    smallint not null references categories(id),
  company_name   text not null,
  contact_name   text,
  email          text not null,
  phone          text,
  is_shortlisted boolean not null default false,
  invite_state   text not null default 'draft'
                   check (invite_state in ('draft','armed','invited','suppressed')),
  invited_at     timestamptz,
  reminder_count smallint not null default 0,
  last_reminder_at timestamptz,
  notes          text,
  import_batch   uuid,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index if not exists shortlist_category_email_uq
  on shortlist (category_id, lower(email));
create index if not exists shortlist_email_idx on shortlist (lower(email));
create index if not exists shortlist_invite_state_idx on shortlist (invite_state);

-- CONFIDENTIAL. Admin-only. Never joined into any guest-facing query.
create table if not exists shortlist_results (
  shortlist_id uuid primary key references shortlist(id) on delete cascade,
  score        numeric(6,2),
  placement    text check (placement in ('winner','highly_commended','finalist')),
  judge_notes  text,
  updated_at   timestamptz not null default now()
);

comment on table shortlist_results is
  'CONFIDENTIAL: scores, winner and highly commended. Admin routes only. Never expose in any public route, email template, CSV given to the venue, or API response.';

-- ---------------------------------------------------------------------------
-- Ticket orders and guests
-- ---------------------------------------------------------------------------

create table if not exists orders (
  id                    uuid primary key default gen_random_uuid(),
  stripe_session_id     text not null unique,
  stripe_payment_intent text,
  stripe_price_id       text,
  ticket_type           text not null check (ticket_type in ('single','table8')),
  seats                 smallint not null check (seats > 0),
  amount_total          integer not null,            -- pence
  currency              text not null default 'gbp',
  buyer_name            text,
  buyer_email           text not null,
  buyer_phone           text,
  buyer_company         text,
  shortlist_id          uuid references shortlist(id),
  details_token         uuid not null unique default gen_random_uuid(),
  details_completed_at  timestamptz,
  details_chase_count   smallint not null default 0,
  last_details_chase_at timestamptz,
  status                text not null default 'paid'
                          check (status in ('paid','refunded','cancelled')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists orders_buyer_email_idx on orders (lower(buyer_email));
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_details_pending_idx
  on orders (created_at) where details_completed_at is null;

create table if not exists guests (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id) on delete cascade,
  seat_number         smallint not null,
  full_name           text,
  company             text,
  is_buyer            boolean not null default false,
  dietary_tags        text[] not null default '{}',
  dietary_notes       text,
  accessibility_notes text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (order_id, seat_number)
);

create index if not exists guests_order_idx on guests (order_id);
create index if not exists guests_dietary_idx on guests using gin (dietary_tags);

-- ---------------------------------------------------------------------------
-- Email log. Doubles as the idempotency guard for the automation.
-- ---------------------------------------------------------------------------

create table if not exists email_log (
  id             uuid primary key default gen_random_uuid(),
  template       text not null,
  recipient_email text not null,
  shortlist_id   uuid references shortlist(id) on delete set null,
  order_id       uuid references orders(id) on delete set null,
  resend_id      text,
  status         text not null default 'sent'
                   check (status in ('sent','failed','skipped')),
  error          text,
  dedupe_key     text,
  sent_at        timestamptz not null default now()
);

-- A given template can only ever be sent once per dedupe key. The cron builds
-- the key, so a double invocation can never double-send.
create unique index if not exists email_log_dedupe_uq
  on email_log (template, dedupe_key) where dedupe_key is not null;
create index if not exists email_log_recipient_idx on email_log (lower(recipient_email));

-- ---------------------------------------------------------------------------
-- Dashboard views. None of these touch shortlist_results.
-- ---------------------------------------------------------------------------

create or replace view v_seat_summary as
select
  count(*) filter (where o.ticket_type = 'single')            as single_orders,
  count(*) filter (where o.ticket_type = 'table8')            as table_orders,
  coalesce(sum(o.seats), 0)                                   as seats_sold,
  coalesce(sum(o.amount_total), 0)                            as gross_pence,
  count(*) filter (where o.details_completed_at is not null)  as orders_complete,
  count(*) filter (where o.details_completed_at is null)      as orders_outstanding
from orders o
where o.status = 'paid';

create or replace view v_guest_completion as
select
  count(*)                                          as seats_total,
  count(*) filter (where g.full_name is not null
                     and length(trim(g.full_name)) > 0) as seats_named,
  count(*) filter (where g.full_name is null
                     or length(trim(g.full_name)) = 0)  as seats_unnamed
from guests g
join orders o on o.id = g.order_id and o.status = 'paid';

create or replace view v_dietary_counts as
select
  d.slug,
  d.label,
  d.sort_order,
  count(g.id) as guest_count
from dietary_options d
left join guests g
       on d.slug = any (g.dietary_tags)
left join orders o
       on o.id = g.order_id and o.status = 'paid'
where d.active
group by d.slug, d.label, d.sort_order
order by d.sort_order;

-- Every free-text dietary note, for the venue.
create or replace view v_dietary_notes as
select
  g.id            as guest_id,
  o.id            as order_id,
  o.buyer_name,
  o.buyer_company,
  g.seat_number,
  g.full_name,
  g.dietary_tags,
  g.dietary_notes,
  g.accessibility_notes
from guests g
join orders o on o.id = g.order_id and o.status = 'paid'
where (g.dietary_notes is not null and length(trim(g.dietary_notes)) > 0)
   or (g.accessibility_notes is not null and length(trim(g.accessibility_notes)) > 0)
   or array_length(g.dietary_tags, 1) > 0;

-- Shortlist against bookings. Deliberately excludes score and placement.
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
  coalesce(b.seats, 0)                   as seats_booked,
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

-- ---------------------------------------------------------------------------
-- Row level security: deny by default. Service role bypasses RLS.
-- ---------------------------------------------------------------------------

alter table categories        enable row level security;
alter table dietary_options   enable row level security;
alter table settings          enable row level security;
alter table shortlist         enable row level security;
alter table shortlist_results enable row level security;
alter table orders            enable row level security;
alter table guests            enable row level security;
alter table email_log         enable row level security;

-- No policies are created on purpose. Nothing is readable with the anon key.

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shortlist_updated_at on shortlist;
create trigger shortlist_updated_at before update on shortlist
  for each row execute function set_updated_at();

drop trigger if exists shortlist_results_updated_at on shortlist_results;
create trigger shortlist_results_updated_at before update on shortlist_results
  for each row execute function set_updated_at();

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

drop trigger if exists guests_updated_at on guests;
create trigger guests_updated_at before update on guests
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Seat rows are created automatically when an order lands.
-- ---------------------------------------------------------------------------

create or replace function create_seats_for_order() returns trigger
language plpgsql as $$
begin
  insert into guests (order_id, seat_number, is_buyer)
  select new.id, gs, (gs = 1)
  from generate_series(1, new.seats) gs
  on conflict (order_id, seat_number) do nothing;
  return new;
end;
$$;

drop trigger if exists orders_create_seats on orders;
create trigger orders_create_seats after insert on orders
  for each row execute function create_seats_for_order();
