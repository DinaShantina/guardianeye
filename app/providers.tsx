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
  }, [])

  return <AlertsProvider>{children}</AlertsProvider>
}
