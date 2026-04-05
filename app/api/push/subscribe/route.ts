import { type NextRequest, NextResponse } from 'next/server'
import type { PushSubscription } from 'web-push'
import { setPushSubscription } from '@/lib/server-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Accept either { subscription: PushSubscription } or the subscription object directly
    const subscription: PushSubscription = body.subscription ?? body
    setPushSubscription(subscription)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/push/subscribe error:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
