import { PageHero } from "@/components/pages/page-hero"
import { ImpactStats } from "@/components/sections/impact-stats"
import { CtaBand } from "@/components/sections/cta-band"
import { BookOpen, HeartPulse, Sparkles, HandHeart, ShieldCheck, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata = { title: "Our Objectives" }

const objectives = [
  {
    title: "Educational Support & Scholarships",
    description: "Education is the most powerful tool for breaking the cycle of poverty. Our primary objective is to ensure that no child drops out of school due to financial constraints. We provide school fees, uniforms, textbooks, and stationary. Furthermore, we run after-school coaching programs to assist students who lack academic support at home.",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Accessible Healthcare Interventions",
    description: "We believe healthcare is a fundamental right, not a privilege. Our health objectives center around organizing free medical, dental, and eye-checkup camps in underserved neighborhoods and remote villages. We also manage mobile health units to provide primary healthcare and distribute free medicines to families who cannot afford basic medical treatments.",
    icon: HeartPulse,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    title: "Women & Youth Empowerment",
    description: "To build resilient communities, we must equip women and youth with the skills needed for financial independence. We conduct vocational training workshops ranging from tailoring and handicrafts to basic computer literacy. By enabling self-employment, we help families achieve financial stability and improve their standard of living.",
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Emergency Relief & Nutrition",
    description: "Hunger and natural disasters strike the poorest the hardest. We are committed to providing immediate relief during crises through food distribution drives, ration kits, and emergency shelters. Our ongoing nutrition programs also focus on combating malnutrition among children and expectant mothers in marginalized communities.",
    icon: HandHeart,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Community Upliftment",
    description: "Creating a safe and healthy environment requires active community participation. We run awareness campaigns on sanitation, hygiene, and civic rights. By empowering local leaders and creating self-help groups, we ensure that development is sustainable and community-driven.",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Child Protection & Rights",
    description: "Every child deserves a safe and nurturing childhood. We actively work against child labor and child marriage by collaborating with local authorities and spreading awareness. We also provide counseling and rehabilitation support for vulnerable children rescued from exploitative environments.",
    icon: ShieldCheck,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
]

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Objectives"
        title="Clear goals for measurable impact."
        description="We focus on targeted, structural interventions that families can feel immediately."
        image="/children-receiving-school-supplies-india.png"
      />

      {/* Intro Section */}
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0 lg:max-w-none w-full">
              <div className="absolute inset-0 rounded-3xl bg-navy/5 -rotate-6 scale-105 transition-transform duration-500 hover:rotate-0"></div>
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/women-skill-development-training.png"
                  alt="Women Empowerment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-500">
                <span className="h-[2px] w-8 bg-amber-500"></span> Our Philosophy
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl mb-6">
                Moving beyond charity to create true empowerment.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                At Real Human Education & Charitable Trust, we believe that temporary relief is not enough. To truly transform a society, we must tackle the root causes of poverty, illiteracy, and poor health. 
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Our objectives are crafted not just to provide a helping hand, but to build a foundation upon which individuals can stand on their own. Every initiative we launch is a stepping stone toward a self-reliant and resilient community.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/projects" className="inline-flex items-center justify-center rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-navy/90 hover:shadow-xl">
                  See Our Projects <ArrowRight className="ml-2 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Grid Section */}
      <section className="relative isolate overflow-hidden bg-slate-50 py-16 md:py-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-20">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl">What We Strive to Achieve</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Our core mission is divided into these actionable, focused objectives that guide every project and initiative we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {objectives.map((obj, index) => {
              const Icon = obj.icon
              return (
                <div
                  key={index}
                  className="group relative flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-xl hover:-translate-y-1 hover:ring-navy/20"
                >
                  <div className={`mb-6 inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ${obj.bgColor} ${obj.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="size-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-navy group-hover:text-amber-500 transition-colors">
                    {obj.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {obj.description}
                  </p>

                  {/* Decorative glowing orb on hover */}
                  <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-navy/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Stats & CTA */}
      <ImpactStats />
      <CtaBand />
    </>
  )
}
