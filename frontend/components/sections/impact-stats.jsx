import { GraduationCap, HandHeart, HeartHandshake, Users } from "lucide-react"
import { Counter } from "@/components/shared/counter"
import { Reveal } from "@/components/shared/reveal"
import { IMPACT_STATS } from "@/constants/site"

const ICONS = [HeartHandshake, GraduationCap, Users, HandHeart]

export function ImpactStats() {
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 pb-4">
      <div className="grid grid-cols-2 gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-2 shadow-lift lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border/60 lg:p-0">
        {IMPACT_STATS.map((stat, i) => {
          const Icon = ICONS[i]
          return (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center gap-2 rounded-xl bg-card px-4 py-8 text-center lg:rounded-none">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy/8 text-navy">
                  <Icon className="size-6" />
                </span>
                <Counter
                  to={stat.value}
                  suffix={stat.suffix}
                  className="mt-1 font-serif text-3xl font-bold text-foreground md:text-4xl"
                />
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
