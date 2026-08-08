"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"
import { useSelector } from "react-redux"

const DEFAULT_POINTS = [
  "Free education & school sponsorship for underprivileged children",
  "Healthcare camps, mobile units & medicine distribution",
  "Women empowerment through skill development",
  "Daily community kitchen & disaster relief",
]

export function AboutPreview() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let title = "A grassroots movement for education & human dignity"
  let content = "Founded in Rajkot, Gujarat, Real Human Education & Charitable Trust works at the intersection of education, health and empowerment. We believe every person deserves the chance to learn, grow and live with dignity regardless of where they were born."
  let points = DEFAULT_POINTS

  if (siteContent?.about_preview?.content) {
    try {
      const parsed = JSON.parse(siteContent.about_preview.content)
      if (siteContent.about_preview.title) title = siteContent.about_preview.title
      if (parsed.description) content = parsed.description
      if (Array.isArray(parsed.points) && parsed.points.length > 0) points = parsed.points
    } catch (e) {}
  }

  return (
    <section className="relative overflow-hidden mx-auto max-w-7xl px-4 py-20 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 relative z-10">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
            <Image
              src="/about-volunteers-india.png"
              alt="Real Human Trust volunteers serving the community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -right-3 -top-3 hidden size-24 rounded-2xl border-4 border-accent md:block" />
          <div className="absolute -bottom-3 -left-3 hidden size-24 rounded-2xl border-4 border-lime md:block" />
        </Reveal>

        <div>
          <Reveal>
            <span className="mb-3 inline-flex items-center gap-2 rounded-md bg-accent/18 px-3 py-1 text-xs font-bold uppercase text-navy">
              <span className="size-1.5 rounded-full bg-lime" />
              Who We Are
            </span>
            <h2 className="text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {content}
            </p>
          </Reveal>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <li className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <Button asChild size="lg" className="mt-8 bg-navy text-navy-foreground hover:bg-navy/90">
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
