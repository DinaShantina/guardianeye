'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import mockAlerts from '@/data/mock-alerts.json'

export type AlertSeverity = 'urgent' | 'warning'
export type AlertCategory =
  | 'explicit_content'
  | 'stranger_contact'
  | 'self_harm'
  | 'meeting_language'
  | 'flagged_video'

export type MessageThread = {
  sender: string
  text: string
  timestamp: string
}

export type AlertEvent = {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  senderName: string
  senderPhoto: string
  childReplied: boolean
  messagePreview: string
  sourceApp: string
  sourceDevice: 'android' | 'pc'
  timestamp: string
  isFirstContact: boolean
  thread: MessageThread[]
  read: boolean
}

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

  const addAlert = (alert: AlertEvent) => {
    setAlerts((prev) => [alert, ...prev])
  }

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
