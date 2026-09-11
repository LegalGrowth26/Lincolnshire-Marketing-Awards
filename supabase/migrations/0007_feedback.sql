begin;

create table if not exists feedback (
  id                uuid primary key default gen_random_uuid(),
  year              smallint not null default 2026,

  rating_overall        smallint check (rating_overall       between 1 and 5),
  rating_venue          smallint check (rating_venue         between 1 and 5),
  rating_food           smallint check (rating_food          between 1 and 5),
  rating_entertainment  smallint check (rating_entertainment between 1 and 5),
  rating_ceremony       smallint check (rating_ceremony      between 1 and 5),

  length_felt       text check (length_felt  in ('too_short','about_right','too_long')),
  price_felt        text check (price_felt   in ('too_cheap','about_right','too_expensive')),
  would_return      text check (would_return in ('yes','maybe','no')),
  would_enter       text check (would_enter  in ('yes','maybe','no','did_not_enter')),

  best_part         text,
  would_change      text,
  category_ideas    text,
  anything_else     text,

  is_anonymous      boolean not null default true,
  name              text,
  business          text,
  email             text,

  created_at        timestamptz not null default now(),

  constraint feedback_anonymous_is_anonymous check (
    not is_anonymous
    or (name is null and business is null and email is null)
  )
);

create index if not exists feedback_year_idx on feedback (year, created_at desc);

comment on table feedback is
  'Post event feedback. When is_anonymous is true no identifying field is stored, and the application must not log an IP address for that request.';

commit;
