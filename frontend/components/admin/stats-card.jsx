export function StatsCard({ label, value, hint, icon: Icon, tone = "bg-navy/8 text-navy" }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-serif text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span>}
      </div>
    </div>
  )
}
