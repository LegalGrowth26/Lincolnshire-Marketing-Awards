# Lincolnshire Marketing Awards: ticketing, guest data and shortlist automation

Build spec for the existing Next.js App Router site on Vercel. Implement exactly this.
Do not redesign the existing public page at `app/page.tsx`. Only add to it where noted.

## 1. What this adds

1. A Stripe webhook that turns a ticket purchase into an order record with seats.
2. A post-payment booking page where the buyer names every guest and gives dietary requirements per person.
3. An admin dashboard showing live ticket sales, seats sold, dietary counts, and shortlist versus booked.
4. A CSV importer for the shortlist spreadsheet.
5. A single daily cron that sends the congratulations and invite email, chases people who have not booked, chases missing guest details, and sends the final plan email.

## 2. Confidentiality requirement, read first

The shortlist spreadsheet contains judging scores, the winner, and the highly commended runner up in each category. These must never be visible outside the authenticated admin area.

Hard rules:

- Scores and placement live only in the `shortlist_results` table.
- No file under `app/(public)`, `app/booking`, `app/api/stripe`, `app/api/booking`, or `emails/` may import, select, or reference `shortlist_results`, `score`, or `placement`.
- The email sending module must accept only a whitelisted set of merge fields. Anything else throws. See section 9.
- The venue CSV export contains names and dietaries only. No category, no score, no placement.
- Add `docs/CONFIDENTIAL.md` restating this, and a comment at the top of `lib/results.ts` (the only module allowed to read that table).

Shortlist size varies by category: eight have four, three have three, one has two, one has six. Never hardcode a shortlist length anywhere.

A business can be shortlisted in several categories. In the real 2026 data there are 57 nominations across only 37 unique email addresses, and four businesses appear three times. Anything that emails or counts shortlisted businesses must group by `lower(email)`, or people receive three congratulations emails and the dashboard overstates the shortlist.

## 3. Stack

- Next.js App Router, TypeScript, Tailwind. Match the existing style in `app/page.tsx`.
- Supabase Postgres, accessed server side only with the service role key. Schema is in `supabase/migrations/0001_awards_platform.sql`, already written. Run it as is. Do not invent column names, read the file.
- Stripe Node SDK for webhook verification and session retrieval.
- Resend for all outbound email.
- `jose` for the admin session cookie.

Install: `stripe`, `resend`, `@supabase/supabase-js`, `jose`, `papaparse`.

## 4. Environment variables

```
NEXT_PUBLIC_SITE_URL=https://lincolnshiremarketingawards.co.uk
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_SINGLE=
STRIPE_PRICE_TABLE8=
TICKET_URL_SINGLE=https://buy.stripe.com/cNi8wQ3gBdRl0S38pwgA80c
TICKET_URL_TABLE8=https://buy.stripe.com/4gM4gA4kF5kP58j218gA80d
RESEND_API_KEY=
EMAIL_FROM=Lincolnshire Marketing Awards <awards@lincolnshiremarketing.co.uk>
EMAIL_REPLY_TO=tom@lincolnshiremarketing.co.uk
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
CRON_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY` must never be referenced in a client component. Create `lib/supabase.ts` exporting a single server-only client, with `import 'server-only'` at the top.

## 5. Ticket products

| Type | Seats | Env var for the link | Env var for the price id |
|---|---|---|---|
| Single ticket | 1 | `TICKET_URL_SINGLE` | `STRIPE_PRICE_SINGLE` |
| Table of 8 | 8 | `TICKET_URL_TABLE8` | `STRIPE_PRICE_TABLE8` |

Seat mapping in the webhook, in this order:

1. Expand `line_items` on the session. If the price id matches `STRIPE_PRICE_TABLE8`, seats is 8 times quantity, ticket type `table8`. If it matches `STRIPE_PRICE_SINGLE`, seats is quantity, type `single`.
2. If neither matches, fall back to the payment link id if present in `session.payment_link`.
3. If still unresolved, insert the order with `seats = 1`, `ticket_type = 'single'`, and write an `email_log` row with template `internal_unmapped_order` so Tom is alerted rather than the sale being lost.

Quantity matters. Someone can buy two tables on one link. Always multiply.

## 6. Stripe webhook

`app/api/stripe/webhook/route.ts`

- `export const runtime = 'nodejs'` and read the raw body with `await req.text()`. Do not parse before verifying.
- Verify with `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`. Return 400 on failure.
- Handle `checkout.session.completed`. Ignore other events with a 200.
- Guard on `session.payment_status === 'paid'`. If it is `unpaid` (delayed methods), return 200 and take no action; `checkout.session.async_payment_succeeded` should be handled identically to completed, so route both through the same handler.
- Insert into `orders` using `stripe_session_id` for idempotency. Use an upsert on that unique column so a Stripe retry cannot create a duplicate. The database trigger creates the seat rows.
- Populate `buyer_email` from `session.customer_details.email`, `buyer_name` from `session.customer_details.name`, `buyer_phone` from `session.customer_details.phone`.
- Try to link to the shortlist: match `lower(buyer_email)` against `shortlist.email`. If exactly one row matches, set `shortlist_id`. If more than one, leave null.
- Send the `ticket_confirmation` email immediately, with a dedupe key of the session id.
- Send `internal_sale_alert` to `EMAIL_REPLY_TO`.
- Always return 200 once the order is stored, even if the email fails. Log the email failure to `email_log` with status `failed`. A failed email must never cause Stripe to retry and duplicate work.

## 7. Post-payment redirect

Stripe payment links support redirecting to a URL containing `{CHECKOUT_SESSION_ID}`. Tom will set both links to redirect to:

```
https://lincolnshiremarketingawards.co.uk/api/stripe/return?session_id={CHECKOUT_SESSION_ID}
```

`app/api/stripe/return/route.ts`

- Look up the order by `stripe_session_id`.
- The webhook can lag the redirect by a second or two. Poll for the order up to five times with a 400ms gap.
- If found, redirect to `/booking/{details_token}`.
- If still not found, retrieve the session directly from Stripe, create the order inline using the same code path as the webhook, then redirect. This makes the flow work even if the webhook is briefly down.
- If Stripe retrieval also fails, redirect to `/booking/pending` which explains that a confirmation email is on its way.

## 8. Booking page

`app/booking/[token]/page.tsx`, server component, looks the order up by `details_token`. Unknown token renders a 404. No auth beyond the token, so treat it as a secret and never log it.

The form renders one block per seat, numbered. Seat 1 is prefilled with the buyer's name and marked "you".

Per seat:

- Full name, required.
- Company or job title, optional.
- Dietary requirements, a multi-select of the `dietary_options` rows. Selecting "No requirements" clears the others.
- Dietary notes, free text, required if "Other" is ticked. Placeholder: "Tell us anything the kitchen needs to know".
- Accessibility or seating notes, optional.

Behaviour:

- Save progress per seat, do not force all eight at once. The buyer can return to the same link any time before the event.
- A visible "you can come back to this link later" note plus a "save and finish later" button.
- On save, upsert into `guests` keyed on `(order_id, seat_number)`.
- Set `orders.details_completed_at` when every seat for that order has a non-empty `full_name`. Clear it back to null if a name is later removed.
- After completing all seats, show a confirmation with the event details pulled from `settings` and send `details_complete` email once.

`app/api/booking/[token]/route.ts` handles the POST. Validate the token, validate that `seat_number` is within `orders.seats`, reject anything else with a 400. Rate limit to 30 requests per token per minute.

## 9. Email

`lib/email.ts` exposes one function:

```ts
sendTemplate({ template, to, data, dedupeKey, shortlistId, orderId })
```

- Templates live in `emails/` as functions returning `{ subject, html, text }`.
- Before sending, assert that `data` contains only keys from that template's declared whitelist. Throw on anything else. This is the guard that stops a score or placement ever reaching an entrant.
- Every send writes an `email_log` row. Insert the log row first with the dedupe key. If the unique index rejects it, the email has already been sent, so return without sending. This makes the cron safe to run twice.
- Always send both an HTML and a plain text part.
- Copy for all templates is in `docs/email-copy.md`. Use it verbatim. Do not rewrite it, and do not add em dashes or en dashes anywhere.

Templates:

| Key | Trigger | Whitelisted fields |
|---|---|---|
| `shortlist_invite` | cron, when `invite_state = 'armed'` | `contact_name`, `company_name`, `categories`, `category_count`, `single_url`, `table_url`, `event_date`, `venue`, `arrival_time`, `dress_code` |
| `shortlist_reminder` | cron, invited and not booked | same as above, plus `days_left` |
| `ticket_confirmation` | webhook | `buyer_name`, `seats`, `ticket_type_label`, `booking_url`, `event_date`, `venue`, `arrival_time`, `dress_code` |
| `details_chase` | cron, order incomplete | `buyer_name`, `seats_unnamed`, `booking_url` |
| `details_complete` | all seats named | `buyer_name`, `seats`, `event_date`, `venue`, `arrival_time`, `dress_code` |
| `event_plan` | cron, N days before | `guest_first_name`, `event_date`, `venue`, `arrival_time`, `dress_code`, `running_order` |
| `internal_sale_alert` | webhook | `buyer_name`, `buyer_email`, `ticket_type_label`, `seats`, `amount`, `seats_sold_total` |
| `internal_unmapped_order` | webhook fallback | `stripe_session_id`, `amount` |

Note the invite whitelist. `category_title` is allowed because being shortlisted in a category is public. Score and placement are not in any whitelist and never will be.

## 10. Admin area

Protect `/admin/*` with middleware. Single shared password in `ADMIN_PASSWORD`, checked at `/admin/login`, which sets a signed httpOnly, secure, sameSite=lax JWT cookie via `jose` with a 7 day expiry. Middleware verifies it and redirects to login otherwise. Add a simple 10 attempts per 15 minutes throttle on the login route.

### `/admin` dashboard

Top row of cards:

- Seats sold, against `capacity_seats`, with a progress bar.
- Gross revenue, formatted in pounds from the pence figure.
- Orders, split single and table.
- Guest details complete, as "X of Y seats named" with the outstanding count highlighted amber if above zero.

Then:

- **Dietary requirements.** Live counts from `v_dietary_counts`, biggest first, and a separate panel listing every free text note from `v_dietary_notes` with the guest name and buyer next to it. This is the panel Tom hands the venue, so give it a "Copy for venue" button and a CSV download containing name, company, dietary tags, notes, accessibility notes, and nothing else.
- **Shortlist versus attendance.** Table from `v_shortlist_status` grouped by category, showing company, contact, invited state, booked yes or no, seats booked. Filter chips for "shortlisted, not yet invited", "invited, not booked", "booked". Category groups show their own count rather than assuming four.
- **Guest list.** Every seat with buyer, company, name, dietaries, editable inline so Tom can fix a name over the phone.
- **Recent activity.** Last 20 `email_log` rows and last 20 orders.

Use polling with `revalidate = 0` and a 60 second client refresh so it reads as live without websockets.

### `/admin/shortlist`

CSV import in four steps:

1. Upload. Parse client side with papaparse, send rows to the server.
2. Column mapping. Show the detected headers and let Tom map them to: category, company name, contact name, email, phone, score, placement. Do not assume the spreadsheet's column names. Remember the mapping in `settings` so the next import is one click.
3. Preview. Show what will be created and updated, flag rows with an unrecognised category or an invalid email, and show a count per category so Tom can eyeball that the two and six category shortlists came through correctly.
4. Confirm. Upsert into `shortlist` on `(category_id, lower(email))`, and write score and placement into `shortlist_results`. Stamp all rows with the same `import_batch` uuid.

After import, a per category screen where Tom ticks who is actually shortlisted. Only ticked rows can be armed. Score and placement are visible on this screen only, behind a "Show results" toggle that is off by default, with a warning that the screen is confidential and should not be shared.

### `/admin/settings`

Edit the `settings` rows: event date, venue, arrival time, dress code, capacity, reminder day arrays, and the master `automation_enabled` switch.

### Arming the invites

Invites do not send on import. Tom selects shortlisted rows and clicks "Arm invites", which sets `invite_state = 'armed'`. A confirmation dialog states how many emails will go out and that it cannot be undone once sent. The cron then sends them. There is also a "Send now" button that runs the same job immediately rather than waiting for the cron.

## 11. Automation

Vercel Hobby allows one cron run per day with an hour of timing slop, so use a single daily job that does all four tasks. This also works unchanged on Pro.

`vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/daily", "schedule": "0 9 * * *" }]
}
```

`app/api/cron/daily/route.ts`

- Reject unless the `Authorization` header equals `Bearer ${CRON_SECRET}`. Vercel sends this automatically when `CRON_SECRET` is set.
- If `settings.automation_enabled` is false, log and exit. This is the safety catch.
- `export const maxDuration = 60`.

Tasks, in order, each wrapped in its own try/catch so one failure does not stop the rest:

1. **Invites.** Armed, shortlisted rows, **grouped by lower(email)**. One email per person naming every category they are shortlisted in, never one per nomination. Dedupe key `invite:{email}`. On success set `invite_state = 'invited'` and `invited_at` on every row in the group.
2. **Booking reminders.** Also grouped by email. Skip the whole group if any of their rows shows booked. `reminder_count` is the max across the group; stop when it reaches the length of `invite_reminder_days`. Dedupe key `reminder:{email}:{reminder_count}`. Increment on every row in the group. Stop entirely once the event date passes.
3. **Details chases.** Orders where `status = 'paid'`, `details_completed_at is null`, `details_chase_count` below the length of `details_chase_days`, and the interval has elapsed since `created_at`. Send `details_chase`, dedupe key `chase:{order_id}:{details_chase_count}`.
4. **Event plan.** If today is exactly `plan_email_days_before` days before `event_date`, send `event_plan` to every buyer of a paid order, dedupe key `plan:{order_id}`. Send to the buyer, not each guest, since only the buyer's email is captured.

Add a "Run daily job now" button on `/admin` that hits the same handler with the secret, so Tom never has to wait for a cron to test something.

Every task appends a summary to `email_log` and the run result is shown on the dashboard.

## 12. Public site changes

Small and contained.

- Add a `/tickets` page with the two Stripe buttons, price, what is included, and the event details from `settings`.
- Change the "Tickets Available Soon" pill in the awards night section of `app/page.tsx` into a link to `/tickets`.
- Add "Tickets" to the nav.
- Nothing else on the public page changes.

## 13. Acceptance checks

Before calling this done, verify:

1. A test mode single ticket purchase creates one order, one seat, and delivers the confirmation email with a working booking link.
2. A test mode table of 8 purchase creates one order with eight seat rows.
3. Replaying the same Stripe webhook event does not create a second order or a second email.
4. Naming seven of eight guests leaves `details_completed_at` null. Naming the eighth sets it.
5. `v_dietary_counts` totals reconcile against the number of named seats.
6. Running the daily cron twice in a row sends nothing the second time.
7. `grep -ri "placement\|shortlist_results\|score" app/ emails/` returns hits only inside `/admin` routes and `lib/results.ts`.
8. Hitting `/admin` logged out redirects to login. Hitting any admin API route without the cookie returns 401.
9. The venue CSV contains no category, score, or placement column.
