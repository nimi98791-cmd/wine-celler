export default function ScanningOverlay() {
  return (
    <div
      className="fixed inset-0 bg-neutral-950/90 z-30 flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Scanning wine bottle"
    >
      <div className="w-11 h-11 rounded-full border-2 border-wine-red/25 border-t-wine-red animate-spin" />
      <p className="text-white/55 text-sm">Scanning your wine…</p>
    </div>
  )
}
