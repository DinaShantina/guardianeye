'use client'

import { MessageThread } from '@/lib/alerts-store'

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

interface ConversationThreadProps {
  thread: MessageThread[]
  childName?: string
}

export default function ConversationThread({ thread, childName = 'Дина' }: ConversationThreadProps) {
  if (thread.length === 0) {
    return (
      <p className="text-sm text-zinc-400 italic py-4 text-center">No messages in thread.</p>
    )
  }

  // Precompute which messages need a date separator (no mutation during render)
  const dateLabels = thread.map((msg) => formatDate(msg.timestamp))
  const showDateSeparator = dateLabels.map((label, i) => i === 0 || label !== dateLabels[i - 1])

  return (
    <div className="space-y-1">
      {thread.map((msg, i) => {
        const dateLabel = dateLabels[i]
        const showDate = showDateSeparator[i]
        const isChild = msg.sender === childName

        return (
          <div key={i}>
            {showDate && (
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 px-2 flex-shrink-0">
                  {dateLabel}
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
              </div>
            )}
            <div className={`flex flex-col ${isChild ? 'items-end' : 'items-start'} mb-2`}>
              {/* Sender label */}
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5 px-1">
                {msg.sender}
              </span>
              {/* Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  isChild
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              {/* Timestamp */}
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
