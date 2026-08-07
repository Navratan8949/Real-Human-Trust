import Image from "next/image"
import Link from "next/link"
import { CalendarDays } from "lucide-react"

function hrefFor(type, id) {
  if (type === "project") return `/projects/${id}`
  if (type === "event") return `/events/${id}`
  if (type === "campaign") return `/crowdfunding/${id}`
  if (type === "news") return `/news/${id}`
  return "#"
}

export function CardsGrid({ items = [], type }) {
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-navy">Nothing to show yet</h3>
          <p className="mt-2 text-muted-foreground">Check back later for updates in this section.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const hasProgressBar = (type === "campaign" || type === "project") && (item.targetAmount > 0 || item.goalAmount > 0);
          const goal = item.targetAmount || item.goalAmount || 1;
          const raised = item.raisedAmount || 0;
          const progress = Math.min(100, (raised / goal) * 100);

          return (
            <Link key={item._id} href={hrefFor(type, item._id)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
              <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-muted">
                {(item.image?.url || (typeof item.image === 'string' && item.image)) ? (
                  <Image src={item.image?.url || item.image} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width:1024px) 33vw, 100vw" />
                ) : (
                  <span className="font-serif text-muted-foreground">No Image</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-navy">{item.category || item.type || item.status || "Trust"}</p>
                <h2 className="mt-2 font-serif text-xl font-semibold leading-snug group-hover:text-navy">{item.title}</h2>
                <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.description || item.content}</p>
                
                {type === "event" && item.eventDate && (
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CalendarDays className="size-4 text-navy" />
                    {new Date(item.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
                
                {hasProgressBar && (
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="text-navy">₹{raised.toLocaleString("en-IN")} / ₹{goal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-5 border-t border-border/50 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-accent">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
