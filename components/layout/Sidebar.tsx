'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAlerts } from '@/lib/alerts-store'
import StatusIndicator from './StatusIndicator'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: '/alerts', label: 'Alerts' },
  { href: '/report', label: 'Report' },
  { href: '/settings', label: 'Settings' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { unreadCount } = useAlerts()

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col',
        'border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        'transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:z-auto md:translate-x-0',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
        <Link
          href="/"
          onClick={onClose}
          className="text-base font-semibold text-zinc-900 dark:text-white"
        >
          GuardianEye
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Close menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const badge = href === '/alerts' && unreadCount > 0 ? unreadCount : null

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white',
              ].join(' ')}
            >
              {label}
              {badge !== null && (
                <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status indicator — pinned to bottom on desktop */}
      <div className="hidden border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 md:block">
        <StatusIndicator />
      </div>
    </aside>
  )
}
