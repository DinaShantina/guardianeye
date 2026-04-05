'use client'

import Link from 'next/link'
import { AlertEvent, AlertCategory } from '@/lib/alerts-store'

const REPORT_GROUPS: {
  label: string
  categories: AlertCategory[]
  description: string
}[] = [
  {
    label: 'Inappropriate Content',
    categories: ['explicit_content', 'self_harm'],
    description: 'Explicit material, harmful searches, or self-harm signals',
  },
  {
    label: 'Conversations with Unknown Contacts',
    categories: ['stranger_contact'],
    description: 'Messages from people not on the approved contacts list',
  },
  {
    label: 'Suspicious Meeting or Photo Requests',
    categories: ['meeting_language'],
    description: 'Requests to meet in person or send private photos',
  },
  {
    label: 'Flagged Video Content',
    categories: ['flagged_video'],
    description: 'Videos watched or searched with concerning themes',
  },
]

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface WeeklyReportProps {
  alerts: AlertEvent[]
}

export default function WeeklyReport({ alerts }: WeeklyReportProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Clean week
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
          No flagged events this week. Everything looks good.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {REPORT_GROUPS.map((group) => {
        const groupAlerts = alerts.filter((a) =>
          (group.categories as string[]).includes(a.category)
        )
        if (groupAlerts.length === 0) return null

        return (
          <section key={group.label}>
            <div className="mb-2">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {group.label}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{group.description}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-200 dark:divide-zinc-800">
              {groupAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/alerts/${alert.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.severity === 'urgent' ? 'bg-red-500' : 'bg-yellow-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium truncate">
                        {alert.senderName}
                      </span>
                      <span className="text-xs text-zinc-400 flex-shrink-0">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {alert.messagePreview}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-zinc-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
