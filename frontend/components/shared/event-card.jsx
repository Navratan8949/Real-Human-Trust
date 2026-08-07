import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

export function EventCard({ event }) {
  const date = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : ""

  return (
    <Link href={`/events/${event._id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.image?.url || (typeof event.image === 'string' ? event.image : null) || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-navy">{event.title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
          <div className="mt-4 space-y-1.5 text-xs font-medium text-muted-foreground">
            {date && (
              <p className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-navy" />
                {date}
              </p>
            )}
            {event.location && (
              <p className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-navy" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
