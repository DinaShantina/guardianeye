'use client'

import { useAlerts } from '@/lib/alerts-store'
import AlertFeed from '@/components/alerts/AlertFeed'

export default function AlertsPage() {
  const { alerts } = useAlerts()

  const sorted = [...alerts].sort((a, b) => {
    if (a.severity === b.severity) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }
    return a.severity === 'urgent' ? -1 : 1
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          All Alerts
        </h1>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {alerts.length} event{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <AlertFeed alerts={sorted} />
      </div>
    </div>
  )
}
