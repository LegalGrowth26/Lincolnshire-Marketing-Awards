# Setup, in order

Follow these top to bottom. Nothing sends email until step 7, so it is safe to
work through this on the live site.

## 1. Install the packages

```bash
npm install stripe resend @supabase/supabase-js jose papaparse server-only
npm install -D @types/papaparse
```

## 2. Create the database

Supabase project, then SQL Editor, then paste and run
`supabase/migrations/0001_awards_platform.sql` in full. It creates the tables,
the dashboard views, row level security, and seeds the 15 categories and the
dietary options.

Check afterwards: `select count(*) from categories;` should return 15.

## 3. Environment variables in Vercel

Set these on Production and Preview.

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live domain, no trailing slash |
| `SUPABASE_URL` | Supabase, Project Settings, API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page, service_role key. Secret, server only |
| `STRIPE_SECRET_KEY` | Stripe, Developers, API keys |
| `STRIPE_WEBHOOK_SECRET` | Created in step 5 |
| `STRIPE_LINK_SINGLE` | Step 4. `plink_` id of the single-ticket payment link |
| `STRIPE_LINK_TABLE8` | Step 4. `plink_` id of the table-of-8 payment link |
| `TICKET_URL_SINGLE` | `https://buy.stripe.com/cNi8wQ3gBdRl0S38pwgA80c` |
| `TICKET_URL_TABLE8` | `https://buy.stripe.com/4gM4gA4kF5kP58j218gA80d` |
| `RESEND_API_KEY` | Step 6 |
| `EMAIL_FROM` | `Lincolnshire Marketing Awards <awards@yourdomain.co.uk>` |
| `EMAIL_REPLY_TO` | `tom@lincolnshiremarketing.co.uk` |
| `EMAIL_INTERNAL` | Comma-separated internal alert recipients, e.g. `tom@lincolnshiremarketing.co.uk,charlotte@lincolnshiremarketing.co.uk`. Falls back to `EMAIL_REPLY_TO` |
| `ADMIN_PASSWORD` | Pick a long one. This is the only lock on the dashboard |
| `ADMIN_SESSION_SECRET` | 32+ random characters. `openssl rand -base64 32` |
| `CRON_SECRET` | Another 32+ random characters |

## 4. Find your payment link IDs

Stripe Dashboard, Payment links. Open each of the two links and copy its ID,
which starts `plink_`. One goes in `STRIPE_LINK_SINGLE`, the other in
`STRIPE_LINK_TABLE8`.

Imports are filtered by these two links: a session paid through the single
link is 1 seat, through the table link 8 seats per quantity, and anything
paid through any other link is ignored. A session carrying one of our order
ids (from the /book flow) is always processed regardless of link. If either
variable is unset, the Stripe sync refuses to run rather than importing
everything.

## 5. Point the payment links back at the site

For each of the two payment links: Stripe Dashboard, Payment links, edit, then
**After the payment**. Choose "Redirect customers to your website" and set:

```
https://yourdomain.co.uk/api/stripe/return?session_id={CHECKOUT_SESSION_ID}
```

Type `{CHECKOUT_SESSION_ID}` exactly, braces included. Stripe swaps in the real
value.

While you are in each link, turn on **Collect customers' names**. Phone number
is useful too.

Then create the webhook: Developers, Webhooks, Add endpoint.

- URL: `https://yourdomain.co.uk/api/stripe/webhook`
- Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET`

## 6. Resend

Create an account, add your sending domain, and add the DNS records it gives you
to your domain registrar. Wait for it to verify, which is usually minutes.
Create an API key and put it in `RESEND_API_KEY`.

Send from a subdomain such as `awards@yourdomain.co.uk` on a verified domain.
Sending from a Gmail address will land you in spam.

## 7. First run

1. Deploy. Visit `/admin`, sign in with `ADMIN_PASSWORD`.
2. Go to Settings. Check the event date, venue, arrival time, dress code and
   capacity. Leave **Automated emails** switched off for now.
3. Go to Shortlist. Import your CSV, map the columns, check the per category
   counts in the result. Two categories should show something other than four.
4. Tick who is actually on the shortlist. Only ticked rows can be invited.
5. Buy a test ticket in Stripe test mode. Confirm the order appears, the
   confirmation email arrives, and the booking link works.
6. When you are happy, select the shortlist rows and press **Arm invites**.
   Nothing has sent yet.
7. Turn **Automated emails** on in Settings, then press **Run email jobs now**
   on the dashboard to send the congratulations emails immediately, or leave it
   for the 9am run.

## What runs automatically after that

One job, once a day at 9am:

- Sends the congratulations and invite email to anyone armed and not yet invited.
- Nudges shortlisted people who were invited and have not booked, at 5, 12 and
  21 days after their invite. Configurable in Settings. Stops after the event.
- Chases buyers who have not finished their guest list, at 3, 10 and 21 days
  after booking.
- Sends the running order and know before you go email to every buyer, 7 days
  before the event.

Everything is deduplicated in `email_log`, so running the job twice sends
nothing the second time. The master switch in Settings stops all of it.

## Notes

- Vercel Hobby allows one cron run per day, with up to an hour of timing slop.
  That is why everything is in one job. It works unchanged on Pro if you upgrade.
- `ADMIN_PASSWORD` is a single shared password. It is the right level of
  security for one organiser and a private dashboard. If more people need
  access, move to Supabase Auth with an allowlist.
- Read `docs/CONFIDENTIAL.md` before touching anything to do with the shortlist.
