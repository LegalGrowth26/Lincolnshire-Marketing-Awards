import 'server-only'
import { Resend } from 'resend'
import { sql } from './db'

/**
 * CONFIDENTIALITY GUARD
 * Every template declares the exact merge fields it accepts. sendTemplate throws
 * if it is handed anything else. Scores, placement, winner and highly commended
 * are not in any whitelist, so they cannot reach an entrant even by accident.
 */

let resend: Resend | null = null
function mailer() {
  if (resend) return resend
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  resend = new Resend(key)
  return resend
}

const FROM = () =>
  process.env.EMAIL_FROM ||
  'Lincolnshire Marketing Awards <awards@lincolnshiremarketing.co.uk>'
const REPLY_TO = () => process.env.EMAIL_REPLY_TO || 'tom@lincolnshiremarketing.co.uk'

type Data = Record<string, string | number>

type Template = {
  fields: readonly string[]
  build: (d: Data) => { subject: string; html: string; text: string }
}

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

function layout(bodyHtml: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:#0a0a0a;padding:24px 28px;">
<p style="margin:0;color:#ffffff;font:600 16px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">Lincolnshire Marketing Awards</p>
<p style="margin:6px 0 0;color:rgba(255,255,255,0.55);font:400 12px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;">Lincolnshire &middot; 2026</p>
</td></tr>
<tr><td style="padding:28px;color:#262626;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
${bodyHtml}
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #e5e5e5;color:#8a8a8a;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
Lincolnshire Marketing Awards<br>
Questions? Just reply to this email, it comes straight to Tom.
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0;"><tr><td style="background:#0a0a0a;border-radius:6px;">
<a href="${href}" style="display:inline-block;padding:13px 24px;color:#ffffff;text-decoration:none;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${label}</a>
</td></tr></table>`
}

function p(s: string) {
  return `<p style="margin:0 0 14px;">${s}</p>`
}

function detailBox(d: Data) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;">
<tr><td style="padding:16px 18px;font:400 14px/1.8 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#404040;">
<strong style="color:#0a0a0a;">${d.event_date}</strong><br>
${d.venue}<br>
Arrival from ${d.arrival_time}<br>
Dress code: ${d.dress_code}
</td></tr></table>`
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const TEMPLATES = {
  shortlist_invite: {
    fields: [
      'contact_name',
      'company_name',
      'categories',
      'category_count',
      'single_url',
      'table_url',
      'event_date',
      'venue',
      'arrival_time',
      'dress_code',
    ],
    build: (d) => ({
      subject:
        Number(d.category_count) > 1
          ? `You have been shortlisted in ${Number(d.category_count)} categories`
          : `You have been shortlisted: ${String(d.categories).replace(/^the /, '')}`,
      text: `Hi ${d.contact_name},

Some good news. ${d.company_name} has been shortlisted for ${d.categories} at the Lincolnshire Marketing Awards 2026.

Every entry was scored independently by three judges, and the shortlist is genuinely small. Making it this far says something real about the year you have had.

The awards evening is on ${d.event_date} at ${d.venue}. Arrival is from ${d.arrival_time} and it is ${String(d.dress_code).toLowerCase()}. Winners are announced on the night.

There is no obligation to come, but we would love to have you there, and it is a much better evening with the shortlisted businesses in the room.

Single ticket: ${d.single_url}
Table of 8: ${d.table_url}

Once you have booked you will get a link to add your guest names and any dietary requirements, so the kitchen knows what it is doing well before the night.

Congratulations again.

Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.contact_name},`) +
          p(
            `Some good news. <strong>${d.company_name}</strong> has been shortlisted for <strong>${d.categories}</strong> at the Lincolnshire Marketing Awards 2026.`,
          ) +
          p(
            `Every entry was scored independently by three judges, and the shortlist is genuinely small. Making it this far says something real about the year you have had.`,
          ) +
          detailBox(d) +
          p(
            `Winners are announced on the night. There is no obligation to come, but we would love to have you there, and it is a much better evening with the shortlisted businesses in the room.`,
          ) +
          button(String(d.single_url), 'Book a single ticket') +
          button(String(d.table_url), 'Book a table of 8') +
          p(
            `Once you have booked you will get a link to add your guest names and any dietary requirements, so the kitchen knows what it is doing well before the night.`,
          ) +
          p(`Congratulations again.<br><br>Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  shortlist_reminder: {
    fields: [
      'contact_name',
      'company_name',
      'categories',
      'category_count',
      'single_url',
      'table_url',
      'event_date',
      'venue',
      'arrival_time',
      'dress_code',
      'days_left',
    ],
    build: (d) => ({
      subject: `Still holding a seat for ${d.company_name}`,
      text: `Hi ${d.contact_name},

Just a quick nudge. ${d.company_name} is on the shortlist for ${d.categories}, and we have not seen a booking come through yet.

There are ${d.days_left} days until the evening on ${d.event_date} at ${d.venue}. Tables do go, and I would rather not have a gap where your name should be.

Single ticket: ${d.single_url}
Table of 8: ${d.table_url}

If you cannot make it, no problem at all, and it makes no difference to the judging. A quick reply either way helps me with numbers for the venue.

Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.contact_name},`) +
          p(
            `Just a quick nudge. <strong>${d.company_name}</strong> is on the shortlist for <strong>${d.categories}</strong>, and we have not seen a booking come through yet.`,
          ) +
          p(
            `There are <strong>${d.days_left} days</strong> until the evening. Tables do go, and I would rather not have a gap where your name should be.`,
          ) +
          detailBox(d) +
          button(String(d.single_url), 'Book a single ticket') +
          button(String(d.table_url), 'Book a table of 8') +
          p(
            `If you cannot make it, no problem at all, and it makes no difference to the judging. A quick reply either way helps me with numbers for the venue.`,
          ) +
          p(`Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  ticket_confirmation: {
    fields: [
      'buyer_name',
      'seats',
      'ticket_type_label',
      'booking_url',
      'event_date',
      'venue',
      'arrival_time',
      'dress_code',
    ],
    build: (d) => ({
      subject: `You are booked in. One quick thing needed.`,
      text: `Hi ${d.buyer_name},

Thanks, your ${d.ticket_type_label} is confirmed. That is ${d.seats} seat(s) held in your name.

${d.event_date}
${d.venue}
Arrival from ${d.arrival_time}
Dress code: ${d.dress_code}

One thing left. I need the name of everyone sitting with you and any dietary requirements, so the venue can plan properly:

${d.booking_url}

You do not have to do it all at once. The link saves as you go and stays open until the week of the event, so you can come back when you know who is coming.

See you there.

Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.buyer_name},`) +
          p(
            `Thanks, your <strong>${d.ticket_type_label}</strong> is confirmed. That is <strong>${d.seats} seat(s)</strong> held in your name.`,
          ) +
          detailBox(d) +
          p(
            `One thing left. I need the name of everyone sitting with you and any dietary requirements, so the venue can plan properly.`,
          ) +
          button(String(d.booking_url), 'Add your guest details') +
          p(
            `You do not have to do it all at once. The link saves as you go and stays open until the week of the event, so you can come back when you know who is coming.`,
          ) +
          p(`See you there.<br><br>Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  details_chase: {
    fields: ['buyer_name', 'seats_unnamed', 'booking_url'],
    build: (d) => ({
      subject: `Still need ${d.seats_unnamed} name(s) for your table`,
      text: `Hi ${d.buyer_name},

We are still missing ${d.seats_unnamed} guest name(s) from your booking. The venue needs final numbers and dietary requirements ahead of the night, so if you can fill these in when you get a minute it would really help.

${d.booking_url}

It takes about two minutes and it saves as you go.

Thanks,
Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.buyer_name},`) +
          p(
            `We are still missing <strong>${d.seats_unnamed} guest name(s)</strong> from your booking. The venue needs final numbers and dietary requirements ahead of the night, so if you can fill these in when you get a minute it would really help.`,
          ) +
          button(String(d.booking_url), 'Finish your guest list') +
          p(`It takes about two minutes and it saves as you go.`) +
          p(`Thanks,<br>Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  details_complete: {
    fields: ['buyer_name', 'seats', 'event_date', 'venue', 'arrival_time', 'dress_code'],
    build: (d) => ({
      subject: `All set. Your guest list is in.`,
      text: `Hi ${d.buyer_name},

That is everything. All ${d.seats} of your guests are registered and their dietary requirements have gone to the venue.

${d.event_date}
${d.venue}
Arrival from ${d.arrival_time}
Dress code: ${d.dress_code}

I will send the running order and everything else you need to know about a week before. If anything changes in the meantime, just reply here.

Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.buyer_name},`) +
          p(
            `That is everything. All <strong>${d.seats}</strong> of your guests are registered and their dietary requirements have gone to the venue.`,
          ) +
          detailBox(d) +
          p(
            `I will send the running order and everything else you need to know about a week before. If anything changes in the meantime, just reply here.`,
          ) +
          p(`Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  event_plan: {
    fields: [
      'guest_first_name',
      'event_date',
      'venue',
      'arrival_time',
      'dress_code',
      'running_order',
    ],
    build: (d) => ({
      subject: `Your plan for awards night`,
      text: `Hi ${d.guest_first_name},

Nearly there. Here is everything you need for ${d.event_date}.

Where: ${d.venue}
Arrival: from ${d.arrival_time}
Dress code: ${d.dress_code}

${d.running_order}

Your table number will be on the seating plan by the door. If anyone in your party has changed, or a dietary requirement has come up since you booked, reply to this email and I will sort it.

Looking forward to seeing you.

Tom Stansfield
Lincolnshire Marketing Awards`,
      html: layout(
        p(`Hi ${d.guest_first_name},`) +
          p(`Nearly there. Here is everything you need for the night.`) +
          detailBox(d) +
          `<div style="margin:0 0 14px;white-space:pre-line;">${d.running_order}</div>` +
          p(
            `Your table number will be on the seating plan by the door. If anyone in your party has changed, or a dietary requirement has come up since you booked, reply to this email and I will sort it.`,
          ) +
          p(`Looking forward to seeing you.<br><br>Tom Stansfield<br>Lincolnshire Marketing Awards`),
      ),
    }),
  },

  internal_sale_alert: {
    fields: [
      'buyer_name',
      'buyer_email',
      'ticket_type_label',
      'seats',
      'amount',
      'seats_sold_total',
    ],
    build: (d) => ({
      subject: `Ticket sale: ${d.ticket_type_label} to ${d.buyer_name}`,
      text: `${d.ticket_type_label} sold.

Buyer: ${d.buyer_name} (${d.buyer_email})
Seats: ${d.seats}
Amount: ${d.amount}

Total seats sold so far: ${d.seats_sold_total}`,
      html: layout(
        p(`<strong>${d.ticket_type_label}</strong> sold.`) +
          p(
            `Buyer: ${d.buyer_name} (${d.buyer_email})<br>Seats: ${d.seats}<br>Amount: ${d.amount}<br><br>Total seats sold so far: <strong>${d.seats_sold_total}</strong>`,
          ),
      ),
    }),
  },

  internal_unmapped_order: {
    fields: ['stripe_session_id', 'amount'],
    build: (d) => ({
      subject: `Action needed: unmapped ticket sale`,
      text: `A payment came in that did not match either ticket price id, so it has been recorded as a single seat.

Stripe session: ${d.stripe_session_id}
Amount: ${d.amount}

Check STRIPE_PRICE_SINGLE and STRIPE_PRICE_TABLE8 in Vercel, then correct the seat count in the admin dashboard.`,
      html: layout(
        p(
          `A payment came in that did not match either ticket price id, so it has been recorded as a single seat.`,
        ) +
          p(`Stripe session: <code>${d.stripe_session_id}</code><br>Amount: ${d.amount}`) +
          p(
            `Check <code>STRIPE_PRICE_SINGLE</code> and <code>STRIPE_PRICE_TABLE8</code> in Vercel, then correct the seat count in the admin dashboard.`,
          ),
      ),
    }),
  },
} satisfies Record<string, Template>

export type TemplateKey = keyof typeof TEMPLATES

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

export type SendArgs = {
  template: TemplateKey
  to: string
  data: Data
  /** Same key twice means the second send is skipped. */
  dedupeKey?: string
  shortlistId?: string | null
  orderId?: string | null
}

export type SendResult = { ok: boolean; skipped?: boolean; error?: string }

export async function sendTemplate({
  template,
  to,
  data,
  dedupeKey,
  shortlistId,
  orderId,
}: SendArgs): Promise<SendResult> {
  const def = TEMPLATES[template]
  if (!def) throw new Error(`Unknown template: ${template}`)

  // Whitelist guard. This is what keeps scores and placement out of entrant email.
  const allowed = new Set<string>(def.fields)
  const illegal = Object.keys(data).filter((k) => !allowed.has(k))
  if (illegal.length) {
    throw new Error(
      `Template "${template}" was given fields it does not accept: ${illegal.join(', ')}`,
    )
  }
  const missing = def.fields.filter((f) => data[f] === undefined || data[f] === null)
  if (missing.length) {
    throw new Error(`Template "${template}" is missing fields: ${missing.join(', ')}`)
  }

  // Claim the send first. The unique index on (template, dedupe_key) means a
  // concurrent or repeated run loses the race and sends nothing. This must
  // stay a single INSERT that fails on the index — a SELECT-then-INSERT
  // would reopen the race this guard exists to close.
  let logId: string | null = null
  if (dedupeKey) {
    try {
      const rows = await sql`
        insert into email_log (template, recipient_email, shortlist_id, order_id, dedupe_key, status)
        values (${template}, ${to.toLowerCase()}, ${shortlistId ?? null}, ${orderId ?? null}, ${dedupeKey}, 'sent')
        returning id`
      logId = rows[0].id
    } catch {
      return { ok: true, skipped: true }
    }
  }

  const { subject, html, text } = def.build(data)

  try {
    const res = await mailer().emails.send({
      from: FROM(),
      to,
      replyTo: REPLY_TO(),
      subject,
      html,
      text,
    })
    if (res.error) throw new Error(res.error.message)

    // Log bookkeeping is best-effort: the send has already happened, so a
    // failed write here must not turn a successful send into an error.
    try {
      if (logId) {
        await sql`update email_log set resend_id = ${res.data?.id ?? null} where id = ${logId}`
      } else {
        await sql`
          insert into email_log (template, recipient_email, shortlist_id, order_id, resend_id, status)
          values (${template}, ${to.toLowerCase()}, ${shortlistId ?? null}, ${orderId ?? null}, ${res.data?.id ?? null}, 'sent')`
      }
    } catch {
      // ignore: logging only
    }
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    try {
      // Release the claim so a later run can retry.
      if (logId) await sql`delete from email_log where id = ${logId}`
      await sql`
        insert into email_log (template, recipient_email, shortlist_id, order_id, status, error)
        values (${template}, ${to.toLowerCase()}, ${shortlistId ?? null}, ${orderId ?? null}, 'failed', ${message.slice(0, 500)})`
    } catch {
      // ignore: logging only
    }
    return { ok: false, error: message }
  }
}

export const internalRecipient = () => REPLY_TO()
