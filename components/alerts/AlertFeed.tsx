'use client'

// TODO: Full AlertCard implementation is built in step 5.
// This stub renders a minimal alert list so the home page conditional logic works.

import Link from 'next/link'
import { AlertEvent } from '@/lib/alerts-store'

interface AlertFeedProps {
  alerts: AlertEvent[]
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AlertFeed({ alerts }: AlertFeedProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
        No alerts to display.
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {alerts.map((alert) => (
        <Link
          key={alert.id}
          href={`/alerts/${alert.id}`}
          className={`flex items-start gap-3 px-4 py-4 border-l-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
            alert.severity === 'urgent'
              ? 'border-red-500 bg-red-50/40 dark:bg-red-950/10'
              : 'border-yellow-400 bg-yellow-50/40 dark:bg-yellow-950/10'
          }`}
        >
          {/* Unread dot */}
          <div className="mt-1.5 flex-shrink-0">
            {!alert.read ? (
              <span className="block w-2 h-2 rounded-full bg-blue-500" />
            ) : (
              <span className="block w-2 h-2" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs font-medium uppercase tracking-wide ${
                  alert.severity === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                }`}
              >
                {alert.category.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-zinc-400 flex-shrink-0">
                {formatRelativeTime(alert.timestamp)}
              </span>
            </div>

            <p className={`text-sm mt-0.5 text-zinc-800 dark:text-zinc-200 ${!alert.read ? 'font-semibold' : ''}`}>
              {alert.senderName}
            </p>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {alert.messagePreview}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
