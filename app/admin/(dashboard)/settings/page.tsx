import { getSettings } from '@/lib/config'
import { saveSettings } from '../../actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SettingsPage() {
  const s = await getSettings()

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-500 mt-2">
          Event details feed the website, the booking page and every email. Change them here
          rather than in the code.
        </p>
      </div>

      <form action={saveSettings} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Event date" name="event_date" type="date" defaultValue={s.event_date} />
          <Field label="Venue" name="venue" defaultValue={s.venue} />
          <Field label="Arrival time" name="arrival_time" defaultValue={s.arrival_time} />
          <Field label="Dress code" name="dress_code" defaultValue={s.dress_code} />
          <Field
            label="Capacity, seats"
            name="capacity_seats"
            type="number"
            defaultValue={String(s.capacity_seats)}
          />
        </div>

        <div className="border-t border-neutral-100 pt-6">
          <h2 className="font-bold">Automation</h2>
          <p className="text-sm text-neutral-500 mt-1">
            The daily job runs at 9am. Nothing sends while this switch is off, which is the
            safety catch while you set things up.
          </p>

          <label className="flex items-center gap-3 mt-5">
            <input
              type="checkbox"
              name="automation_enabled"
              defaultChecked={s.automation_enabled}
              className="w-4 h-4"
            />
            <span className="font-semibold">Automated emails are on</span>
          </label>

          <div className="grid sm:grid-cols-3 gap-5 mt-6">
            <Field
              label="Booking reminders, days after invite"
              name="invite_reminder_days"
              defaultValue={s.invite_reminder_days.join(', ')}
              hint="Comma separated. One reminder per number."
            />
            <Field
              label="Guest detail chases, days after booking"
              name="details_chase_days"
              defaultValue={s.details_chase_days.join(', ')}
              hint="Comma separated."
            />
            <Field
              label="Send the plan, days before"
              name="plan_email_days_before"
              type="number"
              defaultValue={String(s.plan_email_days_before)}
            />
          </div>
        </div>

        <button className="bg-neutral-950 text-white px-6 py-2.5 rounded-md font-semibold">
          Save settings
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  hint,
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2"
      />
      {hint && <span className="block text-xs text-neutral-400 mt-1.5">{hint}</span>}
    </label>
  )
}
