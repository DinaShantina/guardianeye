'use client'

import { useAlerts } from '@/lib/alerts-store'
import { useEffect, useState } from 'react'
import AllClearState from '@/components/home/AllClearState'
import Onboarding from '@/components/home/Onboarding'
import AlertFeed from '@/components/alerts/AlertFeed'

function getOnboarded(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('guardianeyeOnboarded') === 'true'
}

function setOnboarded() {
  localStorage.setItem('guardianeyeOnboarded', 'true')
}

export default function Home() {
  const { alerts, unreadCount } = useAlerts()
  const [onboarded, setOnboardedState] = useState(true) // default true to avoid flash
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setOnboardedState(getOnboarded())
    setHydrated(true)
  }, [])

  function handleOnboardingComplete() {
    setOnboarded()
    setOnboardedState(true)
  }

  // Sort alerts: urgent first, then newest first within same urgency
  const unreadAlerts = alerts
    .filter((a) => !a.read)
    .sort((a, b) => {
      if (a.severity === b.severity) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
      return a.severity === 'urgent' ? -1 : 1
    })

  // Avoid layout flash before localStorage hydration
  if (!hydrated) return null

  return (
    <>
      {!onboarded && <Onboarding onComplete={handleOnboardingComplete} />}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {unreadCount > 0 ? (
          // State 1: unread alerts exist — lead with the feed
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Alerts
              </h1>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {unreadCount} unread
              </span>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <AlertFeed alerts={unreadAlerts} />
            </div>
          </section>
        ) : alerts.length > 0 ? (
          // State 2: no unread, but activity exists — today's summary
          <section>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Today&apos;s activity
            </h1>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                All caught up —{' '}
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {alerts.length} event{alerts.length !== 1 ? 's' : ''}
                </span>{' '}
                reviewed today.
              </p>
              <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
                Check the{' '}
                <a href="/alerts" className="underline underline-offset-2 hover:text-zinc-600">
                  Alerts
                </a>{' '}
                tab to review past events or the{' '}
                <a href="/report" className="underline underline-offset-2 hover:text-zinc-600">
                  Weekly Report
                </a>{' '}
                for the full picture.
              </p>
            </div>
          </section>
        ) : (
          // State 3: no alerts, no activity — all clear
          <AllClearState />
        )}
      </div>
    </>
  )
}
