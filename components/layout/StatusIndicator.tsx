export default function StatusIndicator() {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
      <span>Monitoring active</span>
    </div>
  )
}
