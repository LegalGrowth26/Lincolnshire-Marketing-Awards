# Prompt for the Claude Code session on the repo

Paste this as a single message. Drop the contents of `awards-build.zip` into the
repo root first (it mirrors the repo structure, so files land where they belong).

---

I have dropped a set of files into this repo that add ticketing, guest and
dietary capture, an admin dashboard, and automated shortlist emails to the
Lincolnshire Marketing Awards site. They are written against Next.js App Router
15, TypeScript and Tailwind, and they typecheck and build clean in isolation.

Read `BUILD-SPEC.md` and `docs/CONFIDENTIAL.md` first, then do the following on a
new branch:

1. Install the new dependencies:
   `npm install stripe resend @supabase/supabase-js jose papaparse server-only`
   and `npm install -D @types/papaparse`.

2. Reconcile the new files with what is already here. Specifically:
   - `app/page.tsx` is a full replacement. The Enter section, the Apply to Judge
     section, and their nav links and CTAs are removed, and everything now points
     at `/tickets`. Diff it against the current file and keep any changes I have
     made since that are not entry or judge related.
   - `middleware.ts` and `vercel.json` may already exist. Merge rather than
     overwrite: the matcher must cover `/admin/:path*` and `/api/admin/:path*`,
     and the crons array must include the daily job.
   - Do not touch `app/layout.tsx`. There is no replacement for it in the drop.
   - Confirm the `@/*` path alias resolves to the project root in `tsconfig.json`.
     If the project aliases to `./src/*`, move the new `app`, `lib` and
     `middleware.ts` files under `src` to match.

3. If the project is on Next 14 rather than 15, `params` is not a Promise. Remove
   the `await params` and change the types in `app/booking/[token]/page.tsx` and
   `app/api/booking/[token]/route.ts`.

4. Run `npx tsc --noEmit` and `npm run build`. Fix anything that surfaces from
   the merge. Do not change the confidentiality behaviour described in
   `docs/CONFIDENTIAL.md` to make an error go away.

5. Run this leak check and confirm it returns nothing meaningful:
   `grep -rn "shortlist_results" app/ lib/ | grep -v "^app/admin/"`

6. Commit on a branch, push, and give me the Vercel preview URL. Do not merge to
   main yet. I still need to run the SQL migration and set the environment
   variables listed in `SETUP.md`, and the automation master switch defaults to
   off so nothing can email anyone before I am ready.

Tell me anything in the merge you were unsure about rather than guessing.
