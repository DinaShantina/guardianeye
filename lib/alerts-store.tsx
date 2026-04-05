'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import mockAlerts from '@/data/mock-alerts.json'
import type { AlertEvent, AlertSeverity, AlertCategory, MessageThread } from '@/lib/types'

export type { AlertEvent, AlertSeverity, AlertCategory, MessageThread }

type AlertsContextType = {
  alerts: AlertEvent[]
  addAlert: (alert: AlertEvent) => void
  markRead: (id: string) => void
  unreadCount: number
}

const AlertsContext = createContext<AlertsContextType | null>(null)

function getReadIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('guardianeyeReadAlerts') || '[]')
  } catch {
    return []
  }
}

function saveReadIds(ids: string[]) {
  localStorage.setItem('guardianeyeReadAlerts', JSON.stringify(ids))
}

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertEvent[]>(() =>
    (mockAlerts as AlertEvent[]).map((alert) => ({ ...alert }))
  )

  // Sync read state from localStorage on mount
  useEffect(() => {
    const readIds = getReadIds()
    if (readIds.length > 0) {
      setAlerts((prev) =>
        prev.map((alert) =>
          readIds.includes(alert.id) ? { ...alert, read: true } : alert
        )
      )
    }
  }, [])

  const addAlert = useCallback((alert: AlertEvent) => {
    setAlerts((prev) => [alert, ...prev])
  }, [])

  const markRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    )
    const readIds = getReadIds()
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id])
    }
  }

  // Poll for new events from the simulator every 3 seconds
  const lastPolledRef = useRef(Date.now())
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/events?since=${lastPolledRef.current}`)
        if (!res.ok) return
        const newEvents: AlertEvent[] = await res.json()
        lastPolledRef.current = Date.now()
        for (const event of newEvents) {
          addAlert(event)
        }
      } catch {
        // Network errors during polling — ignore silently
      }
    }
    const id = setInterval(poll, 3000)
    return () => clearInterval(id)
  }, [addAlert])

  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, markRead, unreadCount }}>
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts(): AlertsContextType {
  const ctx = useContext(AlertsContext)
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider')
  return ctx
}
