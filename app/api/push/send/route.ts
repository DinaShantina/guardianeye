import { type NextRequest, NextResponse } from 'next/server'
import { getPushSubscription } from '@/lib/server-store'
import { sendPushNotification } from '@/lib/push'

export async function POST(req: NextRequest) {
  try {
    const { title, body, alertId } = await req.json()
    const sub = getPushSubscription()

    if (!sub) {
      return NextResponse.json({ error: 'No subscription stored' }, { status: 404 })
    }

    await sendPushNotification(sub, { title, body, alertId })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/push/send error:', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}
