'use client'

export default function AllClearState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      {/* Shield icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Everything looks good today
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
        No flagged activity. Your daughter&apos;s online world looks safe right
        now. Check back anytime — GuardianEye is watching.
      </p>

      {/* Subtle green accent bar at bottom */}
      <div className="mt-10 w-16 h-1 rounded-full bg-emerald-400 opacity-60" />
    </div>
  )
}
