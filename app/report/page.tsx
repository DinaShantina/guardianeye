'use client'

import { useAlerts } from '@/lib/alerts-store'
import WeeklyReport from '@/components/report/WeeklyReport'

export default function ReportPage() {
  const { alerts } = useAlerts()

  // Showing all alerts for demo. In production, filter to current week:
  // const weekStart = new Date()
  // weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  // weekStart.setHours(0, 0, 0, 0)
  // const weekAlerts = alerts.filter((a) => new Date(a.timestamp) >= weekStart)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Weekly Report
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Flagged activity grouped by category
          </p>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {alerts.length} event{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>
      <WeeklyReport alerts={alerts} />
    </div>
  )
}
