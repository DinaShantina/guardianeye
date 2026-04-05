'use client'

import { useState } from 'react'
import type { AlertEvent } from '@/lib/alerts-store'

type ButtonConfig = {
  label: string
  severity: 'urgent' | 'warning'
  payload: () => AlertEvent
}

function makeId() {
  return `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const EVENT_BUTTONS: ButtonConfig[] = [
  {
    label: 'Explicit content',
    severity: 'urgent',
    payload: () => ({
      id: makeId(),
      severity: 'urgent',
      category: 'explicit_content',
      senderName: 'Непознат контакт',
      senderPhoto: '',
      childReplied: false,
      messagePreview: 'Ти испратив нешто. Погледни сега.',
      sourceApp: 'Viber',
      sourceDevice: 'android',
      timestamp: new Date().toISOString(),
      isFirstContact: true,
      thread: [
        {
          sender: 'Непознат контакт',
          text: 'Ти испратив нешто. Погледни сега.',
          timestamp: new Date().toISOString(),
        },
      ],
      read: false,
    }),
  },
  {
    label: 'Stranger contact',
    severity: 'warning',
    payload: () => ({
      id: makeId(),
      severity: 'warning',
      category: 'stranger_contact',
      senderName: 'Stefan123',
      senderPhoto: '',
      childReplied: true,
      messagePreview: 'Hej, odakle si? Koliko imaš godina?',
      sourceApp: 'Instagram',
      sourceDevice: 'android',
      timestamp: new Date().toISOString(),
      isFirstContact: true,
      thread: [
        {
          sender: 'Stefan123',
          text: 'Hej, odakle si? Koliko imaš godina?',
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
        {
          sender: 'Дина',
          text: 'Од Скопје сум. Зошто прашуваш?',
          timestamp: new Date().toISOString(),
        },
      ],
      read: false,
    }),
  },
  {
    label: 'Self-harm keyword',
    severity: 'urgent',
    payload: () => ({
      id: makeId(),
      severity: 'urgent',
      category: 'self_harm',
      senderName: 'Search query',
      senderPhoto: '',
      childReplied: false,
      messagePreview: 'how to hurt yourself without anyone knowing',
      sourceApp: 'Chrome',
      sourceDevice: 'android',
      timestamp: new Date().toISOString(),
      isFirstContact: false,
      thread: [
        {
          sender: 'Search query',
          text: 'how to hurt yourself without anyone knowing',
          timestamp: new Date().toISOString(),
        },
      ],
      read: false,
    }),
  },
  {
    label: 'Suspicious meeting language',
    severity: 'warning',
    payload: () => ({
      id: makeId(),
      severity: 'warning',
      category: 'meeting_language',
      senderName: 'Marko_92',
      senderPhoto: '',
      childReplied: true,
      messagePreview: 'Ajde da se vidimo posle škole. Znaš gde.',
      sourceApp: 'Snapchat',
      sourceDevice: 'android',
      timestamp: new Date().toISOString(),
      isFirstContact: false,
      thread: [
        {
          sender: 'Marko_92',
          text: 'Ajde da se vidimo posle škole. Znaš gde.',
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          sender: 'Дина',
          text: 'Не знам дали можам.',
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
        {
          sender: 'Marko_92',
          text: 'Nemoj da kažeš roditeljima. Između nas.',
          timestamp: new Date().toISOString(),
        },
      ],
      read: false,
    }),
  },
  {
    label: 'Flagged video content',
    severity: 'warning',
    payload: () => ({
      id: makeId(),
      severity: 'warning',
      category: 'flagged_video',
      senderName: 'YouTube',
      senderPhoto: '',
      childReplied: false,
      messagePreview: 'Watched: "extreme challenge gone wrong compilation #shorts"',
      sourceApp: 'YouTube',
      sourceDevice: 'android',
      timestamp: new Date().toISOString(),
      isFirstContact: false,
      thread: [
        {
          sender: 'YouTube',
          text: 'Watched: "extreme challenge gone wrong compilation #shorts"',
          timestamp: new Date().toISOString(),
        },
      ],
      read: false,
    }),
  },
]

type ToastState = { message: string; ok: boolean } | null

export default function EventButtons() {
  const [toast, setToast] = useState<ToastState>(null)
  const [loading, setLoading] = useState<string | null>(null)

  async function fireEvent(config: ButtonConfig) {
    const payload = config.payload()
    setLoading(config.label)
    setToast(null)

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setToast({ message: `Fired: ${config.label}`, ok: true })
      } else {
        setToast({ message: `Failed to send event`, ok: false })
      }
    } catch {
      setToast({ message: `Sent (API not connected yet — step 10)`, ok: false })
    } finally {
      setLoading(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            toast.ok
              ? 'bg-green-900/60 text-green-300 border border-green-700'
              : 'bg-zinc-800 text-zinc-300 border border-zinc-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid gap-3">
        {EVENT_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => fireEvent(btn)}
            disabled={loading === btn.label}
            className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-left flex items-center justify-between transition-opacity disabled:opacity-50 ${
              btn.severity === 'urgent'
                ? 'bg-red-950 border border-red-700 text-red-200 hover:bg-red-900'
                : 'bg-yellow-950 border border-yellow-700 text-yellow-200 hover:bg-yellow-900'
            }`}
          >
            <span>{btn.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                btn.severity === 'urgent'
                  ? 'border-red-600 text-red-400'
                  : 'border-yellow-600 text-yellow-500'
              }`}
            >
              {btn.severity}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
