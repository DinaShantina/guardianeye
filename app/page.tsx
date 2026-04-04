'use client'

import { useAlerts } from '@/lib/alerts-store'
import { useEffect } from 'react'

export default function Home() {
  const { alerts, unreadCount } = useAlerts()

  useEffect(() => {
    console.log('[GuardianEye] alerts context:', alerts)
    console.log('[GuardianEye] unreadCount:', unreadCount)
  }, [alerts, unreadCount])

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">GuardianEye</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Step 2 verification — check browser console for alerts context.</p>
        <p className="mt-4 text-sm text-zinc-500">Alerts loaded: {alerts.length} | Unread: {unreadCount}</p>
      </main>
    </div>
  )
}
