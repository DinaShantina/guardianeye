import webpush from 'web-push'

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; alertId?: string }
): Promise<void> {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
  await webpush.sendNotification(subscription, JSON.stringify(payload))
}
