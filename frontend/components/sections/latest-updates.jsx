"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNews } from "@/service/news.service"
import { getEvents } from "@/service/event.service"

const serviceLinks = [
  { title: "Register / Join Us", href: "/signup", icon: HeartHandshake, desc: "Apply and become part of the trust network." },
  { title: "Events", href: "/events", icon: CalendarDays, desc: "Register for health camps and community drives." },
  { title: "Reports", href: "/reports/annual", icon: BookOpen, desc: "View public annual and audit reports." },
]

export function LatestUpdates() {
  const [news, setNews] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Fetch News
    getNews()
      .then(data => {
        if (data.success) setNews(data.news.filter(n => n.status === "published").slice(0, 3))
      })
      .catch(console.error)

    // Fetch Events (Upcoming)
    getEvents()
      .then(data => {
        if (data.success) setEvents(data.events.filter(e => e.status === "upcoming").slice(0, 1))
      })
      .catch(console.error)
  }, [])

  return (
    <section className="border-y bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">Latest Updates</h2>
            <Button asChild variant="link" className="px-0 text-navy">
              <Link href="/news">
                View All
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 divide-y rounded-lg border bg-background">
            {news.length > 0 ? news.map((item) => (
              <Link key={item._id} href={`/news/${item._id}`} className="block p-4 transition hover:bg-secondary/70">
                <p className="text-xs font-bold uppercase text-accent">{item.category?.replace("_", " ")}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              </Link>
            )) : (
              <div className="p-4 text-sm text-muted-foreground">No recent updates.</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Quick Services</h2>
          <div className="mt-5 grid gap-3">
            {serviceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="flex gap-3 rounded-lg border bg-background p-4 transition hover:border-accent hover:bg-secondary/70">
                <item.icon className="mt-1 size-5 shrink-0 text-navy" />
                <span>
                  <span className="block font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.desc}</span>
                </span>
              </Link>
            ))}
          </div>
          {events.length > 0 && (
            <div className="mt-4 rounded-lg bg-navy p-4 text-navy-foreground">
              <p className="text-xs font-bold uppercase text-accent">Next Event</p>
              <h3 className="mt-1 font-serif text-lg font-semibold line-clamp-1">{events[0].title}</h3>
              <p className="mt-1 text-sm text-navy-foreground/75 line-clamp-1">{events[0].location}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
