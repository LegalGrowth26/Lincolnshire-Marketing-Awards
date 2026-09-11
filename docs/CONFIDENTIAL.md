# Confidentiality rules for this codebase

The judging spreadsheet contains scores, the winner, and the highly commended
runner up in every category. Winners and highly commended stay confidential
until they are announced at the awards event. Until then, nobody outside the
organising team should be able to learn a result early, including from a
stray API response or an email merge field.

After the announcement, the winners and highly commended for that year are
published on the public year page (`/winners/<year>`), transcribed by hand
into a content file (`content/awards/<year>.ts`) — never read from the
database. Scores and raw judging data are never published, for any year, and
nothing on the public site may read from `shortlist_results`.

## Where results live

Only in the `shortlist_results` table: `score`, `placement`, `judge_notes`.

`placement` is one of `winner`, `highly_commended`, `finalist`.

## Rules

1. `shortlist_results` may only be read from pages under `app/admin/` and from
   server actions in `app/admin/actions.ts`.
2. No public route may select it. That means nothing under `app/tickets`,
   `app/booking`, `app/api/stripe`, `app/api/booking`, `app/winners`, or the
   root page. Published results live in `content/awards/`, entered by hand
   after the event — the public site never queries results out of the
   database.
3. The `v_shortlist_status` view deliberately does not join to it. Do not add
   score or placement columns to that view.
4. Every email template in `lib/email.ts` declares a whitelist of merge fields.
   `sendTemplate` throws if it is handed anything outside that list. Score and
   placement are in no whitelist. Do not add them.
5. The venue CSV at `/api/admin/export/venue` contains guest names, companies,
   dietary requirements and access notes. It must never gain a category, score
   or placement column.
6. On `/admin/shortlist`, scores and results are hidden behind a toggle that is
   off by default. Leave it that way.
7. Shortlist size varies by category. Most have four, one has two, one has six.
   Never hardcode a shortlist length, and never render a fixed grid that implies
   one.

## Check before you ship

```bash
grep -rn "shortlist_results\|placement\|\bscore\b" app/ lib/ emails/ \
  | grep -v "^app/admin/" \
  | grep -v "^lib/email.ts"    # whitelist definitions only
```

Anything that returns outside `app/admin/` is a leak. Fix it before merging.
