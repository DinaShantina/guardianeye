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
  { href: '/simulate', label: 'Simulator' },
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
          className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white"
        >
          {/* GuardianEye logo mark */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" width="32" height="32" style={{flexShrink: 0}}>
            <rect width="200" height="200" rx="32" fill="#0a0a0a"/>
            <path d="M100 24 L160 48 L160 104 C160 140 132 168 100 180 C68 168 40 140 40 104 L40 48 Z"
              stroke="#22c55e" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M58 100 C70 78 130 78 142 100 C130 122 70 122 58 100 Z"
              stroke="#22c55e" strokeWidth="2.5"/>
            <circle cx="100" cy="100" r="14" stroke="#22c55e" strokeWidth="2.5"/>
            <circle cx="100" cy="100" r="5" fill="#22c55e"/>
            <line x1="58" y1="100" x2="84" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4"/>
            <line x1="116" y1="100" x2="142" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4"/>
          </svg>
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
