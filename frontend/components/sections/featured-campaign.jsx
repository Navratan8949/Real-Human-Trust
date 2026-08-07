import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"
import { formatINR } from "@/components/shared/campaign-card"
import { MOCK_CAMPAIGNS } from "@/lib/mock-data"

export function FeaturedCampaign() {
  const campaign = MOCK_CAMPAIGNS[0]
  const pct = Math.min(Math.round((campaign.raisedAmount / campaign.targetAmount) * 100), 100)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
      <Reveal>
        <div className="grid overflow-hidden rounded-lg bg-navy shadow-xl lg:grid-cols-2">
          <div className="relative min-h-64 lg:min-h-full">
            <Image
              src={campaign.image || "/placeholder.svg"}
              alt={campaign.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center p-8 text-navy-foreground md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-accent/20 px-3 py-1 text-xs font-bold uppercase text-accent">
              Active Campaign
            </span>
            <h2 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight md:text-4xl">
              {campaign.title}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-navy-foreground/75">{campaign.description}</p>

            <div className="mt-7">
              <div className="h-3 w-full overflow-hidden rounded-md bg-navy-foreground/15">
                <div className="h-full rounded-md bg-accent" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-accent">{formatINR(campaign.raisedAmount)} raised</span>
                <span className="text-navy-foreground/70">Goal {formatINR(campaign.targetAmount)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/donate">
                  <Heart className="mr-2 size-5" />
                  Donate to this Cause
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
              >
                <Link href="/crowdfunding">See All Campaigns</Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
