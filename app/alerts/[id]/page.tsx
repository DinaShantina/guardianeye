'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAlerts } from '@/lib/alerts-store'
import ConversationThread from '@/components/detail/ConversationThread'

const categoryLabels: Record<string, string> = {
  explicit_content: 'Explicit Content',
  stranger_contact: 'Stranger Contact',
  self_harm: 'Self-Harm',
  meeting_language: 'Meeting Language',
  flagged_video: 'Flagged Video',
}

function AndroidIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Android">
      <path d="M17.523 15.341A1.39 1.39 0 0 1 16.133 16.73a1.39 1.39 0 0 1-1.39-1.39V10.1a1.39 1.39 0 0 1 1.39-1.39 1.39 1.39 0 0 1 1.39 1.39v5.241zM7.867 15.341A1.39 1.39 0 0 1 6.477 16.73a1.39 1.39 0 0 1-1.39-1.39V10.1a1.39 1.39 0 0 1 1.39-1.39 1.39 1.39 0 0 1 1.39 1.39v5.241zM5.611 8.71V14.9c0 .457.122.886.335 1.257l-1.24 1.24a.694.694 0 0 0 .981.981l1.24-1.24c.426.253.921.4 1.45.4h8.246c.529 0 1.024-.147 1.45-.4l1.24 1.24a.694.694 0 0 0 .981-.981l-1.24-1.24c.213-.37.335-.8.335-1.257V8.71H5.611zM9.433 5.02l-.8-1.388a.347.347 0 1 0-.601.347l.814 1.411A5.54 5.54 0 0 0 6.477 8.016h11.046A5.54 5.54 0 0 0 15.154 5.39l.814-1.411a.347.347 0 1 0-.601-.347l-.8 1.388A5.493 5.493 0 0 0 12 4.623a5.493 5.493 0 0 0-2.567.397zM10.39 6.71a.694.694 0 1 1 0-1.389.694.694 0 0 1 0 1.39zm3.22 0a.694.694 0 1 1 0-1.389.694.694 0 0 1 0 1.39z" />
    </svg>
  )
}

function PCIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="PC">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AlertDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { alerts, markRead } = useAlerts()
  const router = useRouter()

  const alert = alerts.find((a) => a.id === id)

  // Mark as read when detail view opens
  useEffect(() => {
    if (alert && !alert.read) {
      markRead(id)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!alert) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">Alert not found.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Go back
        </button>
      </div>
    )
  }

  const severityColor =
    alert.severity === 'urgent'
      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
      : 'text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back button — uses browser history so it works from both /alerts and /report */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-4"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>

      {/* Alert type badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border mb-4 ${severityColor}`}>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            alert.severity === 'urgent' ? 'bg-red-500' : 'bg-yellow-400'
          }`}
        />
        {categoryLabels[alert.category] ?? alert.category}
      </div>

      {/* Sender info card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
              {alert.senderName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {alert.senderName}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-zinc-400 dark:text-zinc-500 text-xs">
              <span>{alert.sourceApp}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                {alert.sourceDevice === 'android' ? <AndroidIcon /> : <PCIcon />}
                {alert.sourceDevice === 'android' ? 'Android' : 'PC'}
              </span>
              <span>·</span>
              <span>{new Date(alert.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* First contact badge */}
        {alert.isFirstContact && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              First message from this person
            </span>
          </div>
        )}

        {!alert.isFirstContact && (
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-zinc-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Previously contacted — returning unknown contact
            </span>
          </div>
        )}
      </div>

      {/* Conversation thread */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-3">
          Conversation
        </h2>
        <ConversationThread thread={alert.thread} />
      </div>
    </div>
  )
}
