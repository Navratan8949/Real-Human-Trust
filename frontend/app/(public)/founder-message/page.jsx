import Image from "next/image"
import { PageHero } from "@/components/pages/page-hero"
import { CtaBand } from "@/components/sections/cta-band"
import { Reveal } from "@/components/shared/reveal"

export const metadata = { title: "Founder's Message" }

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Founder's Message"
        title="Service should feel personal and dependable."
        description="Education and dignity as foundations for change."
        image="/hero-community-education-india.png"
      />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">

          <Reveal delay={0.1}>
            <aside className="space-y-6">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-soft">
                <Image
                  src="/hero-community-education-india.png" // Placeholder for Founder Photo
                  alt="Founder of Real Human Trust"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-navy">Founder Name</h3>
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">Founder & Chairman</p>
                <p className="mt-2 text-sm text-muted-foreground">Real Human Education & Charitable Trust</p>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.2} y={30}>
            <article className="max-w-none text-muted-foreground">
              <h2 className="mb-6 font-serif text-3xl font-bold text-navy sm:text-4xl">A promise to listen, respond, and keep showing up.</h2>

              <p className="mb-4 leading-relaxed">
                Welcome to Real Human Education & Charitable Trust. When we first envisioned this organization, the goal was simple: to create a platform where genuine compassion meets structured, effective action.
              </p>

              <p className="mb-4 leading-relaxed">
                Over the years, I have walked through the narrow lanes of our villages and spoken to countless families. The struggles are real—children unable to afford basic school fees, elderly citizens lacking primary healthcare, and young women waiting for a chance to learn a skill that could change their family's trajectory. These aren't just statistics to us; they are our neighbors, our community.
              </p>

              <p className="mb-4 leading-relaxed">
                <strong className="text-navy">Education as the Great Equalizer</strong>
                <br />
                We firmly believe that education is the foundation of change. When you educate a child, you don't just change their life; you uplift an entire generation. That is why our primary focus remains on providing school supplies, covering tuition fees, and running coaching centers for those who need it most.
              </p>

              <p className="mb-4 leading-relaxed">
                <strong className="text-navy">A Community-Driven Approach</strong>
                <br />
                Real Human Trust is not just an organization; it is a movement powered by you. Every health camp we organize, every child we sponsor, and every relief kit we distribute is a testament to the power of collective giving. Our volunteers are the backbone of this trust, dedicating their time and energy to ensure our programs reach the grassroots level.
              </p>

              <p className="mb-4 leading-relaxed">
                I want to personally invite you to join our mission. Whether you choose to volunteer your time, donate to our campaigns, or simply spread the word, your involvement matters. Together, we can ensure that service feels personal, dependable, and truly transformative.
              </p>

              <div className="mt-12 border-t border-border pt-8">
                <p className="font-serif text-2xl italic text-navy">
                  "Compassion is not just feeling; it is doing."
                </p>
                <div className="mt-6 font-serif text-xl font-bold text-navy">
                  Founder Name
                </div>
                <div className="text-sm uppercase tracking-wide text-muted-foreground">
                  Chairman, Real Human Trust
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* <CtaBand /> */}
    </>
  )
}
