import type { PushSubscription } from 'web-push'
import type { AlertEvent } from '@/lib/types'

// Module-level in-memory state — resets on server restart (acceptable for hackathon demo)

let pushSubscription: PushSubscription | null = null

interface StoredEvent {
  event: AlertEvent
  receivedAt: number
}

const events: StoredEvent[] = []
const MAX_EVENTS = 100

export function setPushSubscription(sub: PushSubscription): void {
  pushSubscription = sub
}

export function getPushSubscription(): PushSubscription | null {
  return pushSubscription
}

export function storeEvent(event: AlertEvent): void {
  events.push({ event, receivedAt: Date.now() })
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS)
  }
}

export function getEventsSince(since: number): AlertEvent[] {
  return events.filter((e) => e.receivedAt > since).map((e) => e.event)
}
