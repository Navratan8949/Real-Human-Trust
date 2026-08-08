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
    } catch (e) { }
  }

  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] relative z-10">

        {/* Left: Editorial Image */}
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[6rem] rounded-b-2xl shadow-2xl border-4 border-white">
            <Image
              src="/about-volunteers-india.png"
              alt="Real Human Trust volunteers serving the community"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Elegant inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
          </div>
          {/* Decorative floating badge */}
          <div className="absolute -bottom-6 -right-6 flex size-28 items-center justify-center rounded-full bg-accent border-[6px] border-white shadow-xl animate-spin-slow">
            <svg viewBox="0 0 100 100" width="90" height="90" className="opacity-90">
              <defs>
                <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text fontSize="11" fontWeight="bold" fill="var(--navy)" letterSpacing="1.8">
                <textPath href="#circle">REAL HUMAN TRUST • EST. 2016 •</textPath>
              </text>
            </svg>
          </div>
        </Reveal>

        {/* Right: Founder's Note / Editorial Text */}
        <div className="lg:pl-8">
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-lime"></span>
              <span className="text-sm font-bold uppercase tracking-widest text-navy">Our Story</span>
            </div>

            <h2 className="text-balance font-serif text-3xl font-bold leading-[1.15] text-navy lg:text-4xl mb-6">
              "{title}"
            </h2>

            <p className="text-pretty text-base leading-relaxed text-muted-foreground whitespace-pre-wrap font-medium">
              {content}
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 pt-8 border-t border-border/50">
            {points.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="text-sm font-semibold text-navy/80 leading-snug">{p}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 flex items-center justify-between">
            <Button asChild className="h-12 rounded-full bg-navy px-6 text-sm font-bold text-white hover:bg-navy/90 hover:-translate-y-0.5 transition-transform">
              <Link href="/about">
                Read Our Full Story
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            {/* Signature Graphic */}
            <div className="hidden sm:block font-serif text-2xl text-accent opacity-50 italic">
              Founder
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
