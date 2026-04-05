'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'guardianeyePushSub'

type SubscriptionStatus = 'checking' | 'not_subscribed' | 'active' | 'denied'

export default function PushConfig() {
  const [status, setStatus] = useState<SubscriptionStatus>('checking')
  const [testResult, setTestResult] = useState<string | null>(null)

  useEffect(() => {
    // Check if we already have a subscription stored
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setStatus('active')
    } else if (Notification.permission === 'denied') {
      setStatus('denied')
    } else {
      setStatus('not_subscribed')
    }
  }, [])

  async function enableNotifications() {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      alert('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set.')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      setStatus('denied')
      return
    }

    try {
      const reg = await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription))

      // TODO: wire to real endpoint in step 10
      // await fetch('/api/push/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(subscription),
      // })

      setStatus('active')
    } catch (err) {
      console.error('Push subscribe failed:', err)
      setStatus('not_subscribed')
    }
  }

  async function sendTestNotification() {
    setTestResult(null)
    // TODO: wire to real endpoint in step 10
    // await fetch('/api/push/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title: 'Test notification', body: 'GuardianEye is working.' }),
    // })
    setTestResult('Test notification sent (API not wired yet — coming in step 10).')
    setTimeout(() => setTestResult(null), 4000)
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        Push Notifications
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        Enable to receive urgent alerts on this device even when the app is closed.
      </p>

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={[
            'h-2 w-2 rounded-full',
            status === 'active' ? 'bg-green-500' : 'bg-zinc-400',
          ].join(' ')}
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          {status === 'checking' && 'Checking…'}
          {status === 'not_subscribed' && 'Not subscribed'}
          {status === 'active' && 'Active — notifications enabled'}
          {status === 'denied' && 'Blocked — notifications denied in browser'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {status !== 'active' && status !== 'denied' && (
          <button
            onClick={enableNotifications}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Enable notifications
          </button>
        )}

        {status === 'active' && (
          <button
            onClick={sendTestNotification}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Send test notification
          </button>
        )}

        {status === 'denied' && (
          <p className="text-xs text-red-500">
            Notifications are blocked. Open browser settings and allow notifications for this site, then reload.
          </p>
        )}
      </div>

      {testResult && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{testResult}</p>
      )}
    </section>
  )
}

// Converts base64url VAPID public key to Uint8Array for pushManager.subscribe
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}
