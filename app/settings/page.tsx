import ApprovedContacts from '@/components/settings/ApprovedContacts'
import PushConfig from '@/components/settings/PushConfig'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Manage contacts and notification preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <ApprovedContacts />
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <PushConfig />
        </div>
      </div>
    </div>
  )
}
