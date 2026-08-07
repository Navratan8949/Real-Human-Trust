import Image from "next/image"
import { Reveal } from "@/components/shared/reveal"
export function ContentSections({ image, stats = [], sections = [] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        {image && (
          <div className="relative min-h-80 overflow-hidden rounded-2xl border border-border/60 shadow-soft">
            <Image src={image} alt="" fill className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
            {stats.length > 0 && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/90 to-transparent p-5 text-white"><div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:text-sm">{stats.map((s) => <span key={s} className="rounded-lg bg-white/10 px-2 py-2 backdrop-blur-sm">{s}</span>)}</div></div>}
          </div>
        )}
        <div className="grid gap-4">
          {sections.map(([heading, body], idx) => (
            <Reveal key={heading} delay={idx * 0.1}>
              <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift">
                <div className="absolute left-0 top-0 h-full w-1 bg-accent/20 transition-all group-hover:bg-accent" />
                <h2 className="font-serif text-2xl font-semibold text-navy">{heading}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
