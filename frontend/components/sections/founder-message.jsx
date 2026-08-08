"use client"
// Force Next.js recompilation
import Image from "next/image"
import { useSelector } from "react-redux"
import { Quote } from "lucide-react"
import { Reveal } from "@/components/shared/reveal"

export function FounderMessageSection() {
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let title = "Message from our Founder"
  let content = "At Real Human Trust, our vision has always been to build a society where every individual has the opportunity to lead a dignified life. True progress is only possible when we empower the most vulnerable among us with education, healthcare, and skills for a better tomorrow."
  let image = "/about-volunteers-india.png"

  if (siteContent?.founder_message) {
    const fm = siteContent.founder_message
    if (fm.title) title = fm.title
    if (fm.content) content = fm.content
    if (fm.image?.url) image = fm.image.url
  }

  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 md:py-20">
      {/* Decorative background elements */}
      <div className="absolute -left-32 -top-32 size-[500px] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-lime/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* Image Side */}
          <Reveal className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border">
              <Image
                src={image}
                alt="Founder"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </div>
            {/* Accent decoration */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl border-4 border-accent hidden md:block" />
          </Reveal>

          {/* Text Side */}
          <div className="relative">
            <Reveal>
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <Quote className="size-6 fill-current" />
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-navy md:text-4xl lg:text-5xl mb-6">
                {title}
              </h2>
            </Reveal>
            
            <Reveal delay={0.1}>
              <div className="prose prose-lg prose-p:leading-relaxed prose-p:text-muted-foreground max-w-none">
                <p className="whitespace-pre-wrap">{content}</p>
              </div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
                  <span className="font-serif text-xl font-bold">R</span>
                </div>
                <div>
                  <p className="font-bold text-navy">Founder & President</p>
                  <p className="text-sm text-muted-foreground">Real Human Education & Charitable Trust</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
