'use client'

import { useEffect } from 'react'
import { AlertsProvider } from '@/lib/alerts-store'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
    }

    // Re-POST stored subscription on every page load — workaround for Vercel cold starts
    // that reset the in-memory subscription in /api/push/subscribe
    const stored = localStorage.getItem('guardianeyePushSub')
    if (stored) {
      fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stored,
      }).catch(() => { /* best-effort */ })
    }
  }, [])

  return <AlertsProvider>{children}</AlertsProvider>
}
