self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = { title: 'GuardianEye', body: 'New alert received.', alertId: null }
  if (event.data) {
    try { data = { ...data, ...event.data.json() } } catch { /* ignore parse errors */ }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.alertId ?? 'guardianeye-alert',
      renotify: true,
      data: { alertId: data.alertId },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const alertId = event.notification.data?.alertId
  const url = alertId ? `/alerts/${alertId}` : '/alerts'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // If the app is already open, focus it and navigate
      for (const client of clients) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client) client.navigate(url)
          return
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
