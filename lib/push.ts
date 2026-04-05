import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; alertId?: string }
): Promise<void> {
  await webpush.sendNotification(subscription, JSON.stringify(payload))
}
