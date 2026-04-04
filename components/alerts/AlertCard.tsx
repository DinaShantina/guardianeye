'use client'

import Link from 'next/link'
import { AlertEvent } from '@/lib/alerts-store'

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const categoryLabels: Record<string, string> = {
  explicit_content: 'Explicit Content',
  stranger_contact: 'Stranger Contact',
  self_harm: 'Self-Harm',
  meeting_language: 'Meeting Language',
  flagged_video: 'Flagged Video',
}

function AndroidIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-label="Android">
      <path d="M17.523 15.341A1.39 1.39 0 0 1 16.133 16.73a1.39 1.39 0 0 1-1.39-1.39V10.1a1.39 1.39 0 0 1 1.39-1.39 1.39 1.39 0 0 1 1.39 1.39v5.241zM7.867 15.341A1.39 1.39 0 0 1 6.477 16.73a1.39 1.39 0 0 1-1.39-1.39V10.1a1.39 1.39 0 0 1 1.39-1.39 1.39 1.39 0 0 1 1.39 1.39v5.241zM5.611 8.71V14.9c0 .457.122.886.335 1.257l-1.24 1.24a.694.694 0 0 0 .981.981l1.24-1.24c.426.253.921.4 1.45.4h8.246c.529 0 1.024-.147 1.45-.4l1.24 1.24a.694.694 0 0 0 .981-.981l-1.24-1.24c.213-.37.335-.8.335-1.257V8.71H5.611zM9.433 5.02l-.8-1.388a.347.347 0 1 0-.601.347l.814 1.411A5.54 5.54 0 0 0 6.477 8.016h11.046A5.54 5.54 0 0 0 15.154 5.39l.814-1.411a.347.347 0 1 0-.601-.347l-.8 1.388A5.493 5.493 0 0 0 12 4.623a5.493 5.493 0 0 0-2.567.397zM10.39 6.71a.694.694 0 1 1 0-1.389.694.694 0 0 1 0 1.39zm3.22 0a.694.694 0 1 1 0-1.389.694.694 0 0 1 0 1.39z" />
    </svg>
  )
}

function PCIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="PC">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

interface AlertCardProps {
  alert: AlertEvent
}

export default function AlertCard({ alert }: AlertCardProps) {
  return (
    <Link
      href={`/alerts/${alert.id}`}
      className={`flex items-start gap-3 px-4 py-4 border-l-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${
        alert.severity === 'urgent'
          ? 'border-red-500 bg-red-50/60 dark:bg-red-950/10'
          : 'border-yellow-400 bg-yellow-50/60 dark:bg-yellow-950/10'
      }`}
    >
      {/* Unread dot */}
      <div className="mt-1 flex-shrink-0 w-2">
        {!alert.read && (
          <span className="block w-2 h-2 rounded-full bg-blue-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Row 1: category label + timestamp */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              alert.severity === 'urgent'
                ? 'text-red-600 dark:text-red-400'
                : 'text-yellow-600 dark:text-yellow-500'
            }`}
          >
            {categoryLabels[alert.category] ?? alert.category}
          </span>
          <span className="text-xs text-zinc-400 flex-shrink-0">
            {formatRelativeTime(alert.timestamp)}
          </span>
        </div>

        {/* Row 2: sender name + source app + device icon */}
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={`text-sm text-zinc-800 dark:text-zinc-200 ${!alert.read ? 'font-semibold' : ''}`}>
            {alert.senderName}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-400 flex-shrink-0">
            <span className="text-xs">{alert.sourceApp}</span>
            {alert.sourceDevice === 'android' ? <AndroidIcon /> : <PCIcon />}
          </div>
        </div>

        {/* Row 3: message preview */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
          {alert.messagePreview}
        </p>

        {/* Row 4: child replied badge */}
        {alert.childReplied && (
          <span className="inline-block mt-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full">
            Child replied
          </span>
        )}
      </div>
    </Link>
  )
}
