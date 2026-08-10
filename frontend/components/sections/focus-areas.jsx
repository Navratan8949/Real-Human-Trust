"use client"

import Image from "next/image"
import * as LucideIcons from "lucide-react"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { Reveal } from "@/components/shared/reveal"
import { useSelector } from "react-redux"

const DEFAULT_AREAS = [
  {
    icon: "GraduationCap",
    title: "Education",
    desc: "Free coaching centres, school sponsorships, books and digital learning for children in need.",
    image: "/rural-classroom-children-learning-india.png",
    color: "from-blue-600/80 to-navy/90",
  },
  {
    icon: "HeartPulse",
    title: "Healthcare",
    desc: "Medical camps, mobile health units and awareness drives bringing care to remote villages.",
    image: "/community-health-camp-india.png",
    color: "from-rose-600/80 to-navy/90",
  },
  {
    icon: "Apple",
    title: "Nutrition",
    desc: "Community kitchens serving daily nutritious meals to the hungry and vulnerable.",
    image: "/community-kitchen-serving-food-india.png",
    color: "from-orange-600/80 to-navy/90",
  },
  {
    icon: "Users2",
    title: "Empowerment",
    desc: "Skill development and micro-enterprise training that helps women stand independently.",
    image: "/women-skill-training-workshop-india.png",
    color: "from-violet-600/80 to-navy/90",
  },
  {
    icon: "TreePine",
    title: "Environment",
    desc: "Tree plantation and sustainability drives for a greener, healthier tomorrow.",
    image: "/tree-plantation-volunteers-india.png",
    color: "from-emerald-600/80 to-navy/90",
  },
  {
    icon: "Sprout",
    title: "Relief & Welfare",
    desc: "Rapid disaster relief, ration kits and support for families during times of crisis.",
    image: "/about-volunteers-india.png",
    color: "from-amber-600/80 to-navy/90",
    icon: "Sprout"
  },
]

export function FocusAreas() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let areas = DEFAULT_AREAS
  if (siteContent?.focus_areas?.content) {
    try {
      const parsed = JSON.parse(siteContent.focus_areas.content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        areas = parsed
      }
    } catch (e) {}
  }

  const GRADIENTS = [
    "from-blue-600/80 to-navy/90",
    "from-rose-600/80 to-navy/90",
    "from-orange-600/80 to-navy/90",
    "from-violet-600/80 to-navy/90",
    "from-emerald-600/80 to-navy/90",
    "from-amber-600/80 to-navy/90",
    "from-cyan-600/80 to-navy/90",
    "from-pink-600/80 to-navy/90",
  ]

  return (
    <section className="bg-white py-16 md:py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="What We Do"
          title="Our areas of impact"
          description="Six focused programs working together to uplift communities and create lasting, measurable change."
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
          {areas.map((a, i) => {
            // Dynamically resolve icon, default to Heart if invalid
            const Icon = LucideIcons[a.icon] || LucideIcons.Heart
            
            // Bento box specific spans
            const isLarge = i === 0;
            const spanClass = isLarge ? "sm:col-span-2 sm:row-span-2" : "col-span-1 row-span-1";
            
            const gradientClass = a.color || GRADIENTS[i % GRADIENTS.length];

            return (
            <Reveal key={i} delay={(i % 3) * 0.1} className={spanClass}>
              <div className="group relative h-full w-full overflow-hidden rounded-3xl bg-navy shadow-xl">
                {/* Background Image */}
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Default Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-0" />

                {/* Hover Colored Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-0 transition-opacity duration-500 group-hover:opacity-90`} />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 transition-transform duration-500">
                  {/* Icon */}
                  <div className={`mb-3 inline-flex items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition-transform duration-500 group-hover:-translate-y-2 ${isLarge ? 'size-12' : 'size-10'}`}>
                    <Icon className={isLarge ? 'size-6' : 'size-5'} />
                  </div>

                  {/* Title */}
                  <h3 className={`font-serif font-bold text-white transition-transform duration-500 group-hover:-translate-y-2 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                    {a.title}
                  </h3>

                  {/* Description (Slides up on hover) */}
                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="mt-3 text-sm leading-relaxed text-white/90 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
