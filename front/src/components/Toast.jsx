export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={[
        'fixed top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full text-[13px] whitespace-nowrap border animate-fade-in-out',
        toast.error
          ? 'bg-red-950 text-red-400 border-red-500/25'
          : 'bg-green-950 text-green-400 border-green-500/25',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  )
}
