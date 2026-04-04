'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAlerts, AlertEvent } from '@/lib/alerts-store'

const categoryLabels: Record<string, string> = {
  explicit_content: 'Explicit Content',
  stranger_contact: 'Stranger Contact',
  self_harm: 'Self-Harm',
  meeting_language: 'Meeting Language',
  flagged_video: 'Flagged Video',
}

export default function NotificationBanner() {
  const { alerts } = useAlerts()
  const prevLengthRef = useRef(alerts.length)
  const [banner, setBanner] = useState<AlertEvent | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (alerts.length > prevLengthRef.current) {
      // New alert prepended via addAlert — it's the first element
      setBanner(alerts[0])
      prevLengthRef.current = alerts.length
    }
  }, [alerts])

  useEffect(() => {
    if (!banner) return
    const timer = setTimeout(() => setBanner(null), 5000)
    return () => clearTimeout(timer)
  }, [banner])

  if (!banner) return null

  const label = categoryLabels[banner.category] ?? banner.category

  return (
    <button
      onClick={() => {
        setBanner(null)
        router.push(`/alerts/${banner.id}`)
      }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 text-sm font-medium flex items-center justify-between shadow-lg text-white ${
        banner.severity === 'urgent' ? 'bg-red-600' : 'bg-yellow-500'
      }`}
    >
      <span>
        New alert:{' '}
        <span className="font-semibold">{label}</span>
        {' '}from{' '}
        <span className="font-semibold">{banner.senderName}</span>
      </span>
      <span className="text-white/75 text-xs ml-4 flex-shrink-0">Tap to view →</span>
    </button>
  )
}
