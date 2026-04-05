import { type NextRequest, NextResponse } from 'next/server'
import type { AlertEvent } from '@/lib/types'
import { storeEvent, getEventsSince, getPushSubscription } from '@/lib/server-store'
import { sendPushNotification } from '@/lib/push'

// Disable static caching — this route reads from in-memory state at request time
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const event: AlertEvent = await req.json()
    storeEvent(event)

    // Send push notification for urgent events if a subscription is stored
    if (event.severity === 'urgent') {
      const sub = getPushSubscription()
      if (sub) {
        try {
          await sendPushNotification(sub, {
            title: `GuardianEye: ${event.category.replace(/_/g, ' ')}`,
            body: event.messagePreview,
            alertId: event.id,
          })
        } catch (pushErr) {
          // Push failure doesn't fail the event POST — log and continue
          console.error('Push send failed:', pushErr)
        }
      }
    }

    return NextResponse.json({ success: true, alertId: event.id })
  } catch (err) {
    console.error('POST /api/events error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const since = parseInt(searchParams.get('since') ?? '0', 10)
  const events = getEventsSince(since)
  return NextResponse.json(events)
}
