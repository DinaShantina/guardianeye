import EventButtons from '@/components/simulate/EventButtons'

export default function SimulatePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white mb-1">Child simulator</h1>
        <p className="text-sm text-zinc-400">
          Fire test events to the parent dashboard. Install this page on the child&apos;s device as
          a PWA. Each button sends a realistic alert payload to{' '}
          <code className="text-zinc-300 bg-zinc-800 px-1 rounded">/api/events</code>.
        </p>
      </div>


      <EventButtons />
    </div>
  )
}
