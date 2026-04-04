'use client'

import { AlertsProvider } from '@/lib/alerts-store'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AlertsProvider>{children}</AlertsProvider>
}
