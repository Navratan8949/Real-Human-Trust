"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { ArrowRight, Heart, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const defaultSlides = [
  {
    image: "/hero-community-education-india.png",
    title: "Empowering lives,",
    highlight: "shaping futures.",
    desc: "Real Human Trust is dedicated to uplifting underprivileged communities through quality education, accessible healthcare, and sustainable empowerment programs across India."
  },
  {
    image: "/community-health-camp-india.png",
    title: "Compassionate care,",
    highlight: "for everyone.",
    desc: "Providing essential medical camps, life-saving healthcare access, and nutritional support to those who need it the most in rural and urban areas."
  },
  {
    image: "/women-skill-training-workshop-india.png",
    title: "Building skills,",
    highlight: "creating leaders.",
    desc: "Empowering women and youth through vocational training, financial literacy, and entrepreneurship programs to build self-reliant futures."
  },
  {
    image: "/about-volunteers-india.png",
    title: "Together we can,",
    highlight: "make a difference.",
    desc: "Join thousands of dedicated volunteers and supporters in our mission to bring hope, dignity, and opportunity to marginalized communities."
  }
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Dynamic backend fetch
  const { data: siteContent } = useSelector((state) => state.siteContent)

  let slides = defaultSlides
  if (siteContent?.home_hero?.content) {
    try {
      const parsed = JSON.parse(siteContent.home_hero.content)
      if (Array.isArray(parsed) && parsed.length > 0) slides = parsed
    } catch (e) {
      slides = defaultSlides
    }
  }

  let stats = [
    { value: "25,000+", label: "Lives Impacted", icon: Users },
    { value: "80G & 12A", label: "Govt. Certified", icon: ShieldCheck }
  ]
  if (siteContent?.impact_stats?.content) {
    try {
      const parsedStats = JSON.parse(siteContent.impact_stats.content)
      if (Array.isArray(parsedStats) && parsedStats.length > 0) {
        stats = parsedStats.map(s => ({
          value: s.value,
          label: s.label,
          icon: s.icon === "Users" ? Users : s.icon === "ShieldCheck" ? ShieldCheck : Heart
        }))
      }
    } catch (e) { }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative flex min-h-[75vh] md:min-h-[85vh] items-center justify-center overflow-hidden bg-black text-white pt-20 pb-16">
      {/* Background Slider */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[currentSlide]?.image || defaultSlides[0].image}
            alt="Hero Background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Centralized Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-navy/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 flex flex-col items-center text-center mt-[-2rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md mb-8">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-lime-500"></span>
              </span>
              Est. 2016 · Rajkot, Gujarat
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-[5rem] drop-shadow-xl text-white">
              {slides[currentSlide]?.title} <br />
              <span className="text-accent italic">{slides[currentSlide]?.highlight}</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-white/90 drop-shadow-md max-w-2xl">
              {slides[currentSlide]?.desc}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-lg transition-transform hover:-translate-y-1 hover:bg-accent/90 border-0"
              >
                <Link href="/donate">
                  <Heart className="mr-2 size-5" />
                  Donate Now
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/30 bg-black/30 backdrop-blur-sm px-8 text-base text-white transition-all hover:-translate-y-1 hover:bg-white/20"
              >
                <Link href="/signup">
                  Become a Member
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats row - Centered */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 border-t border-white/20 pt-8 max-w-4xl">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <stat.icon className={`size-5 ${idx === 0 ? "text-accent" : "text-lime-400"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white drop-shadow-md">{stat.value}</p>
                    <p className="text-xs text-white/80 drop-shadow-md">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-12 sm:bottom-16 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${currentSlide === index ? "w-10 bg-accent" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute inset-x-0 bottom-[-2px] z-30 w-[calc(100%+4px)] -ml-[2px] leading-[0] pointer-events-none">
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="block h-10 w-full md:h-16"
          aria-hidden
        >
          <path
            fill="var(--background)"
            d="M0,32 C180,64 360,8 540,32 C720,56 900,16 1080,36 C1260,56 1380,40 1440,28 L1440,72 L0,72 Z"
          />
        </svg>
      </div>
    </section>
  )
}
