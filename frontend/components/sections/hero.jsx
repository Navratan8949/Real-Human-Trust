"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Heart, Users, MapPin, ShieldCheck, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } },
}

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#0a1628] text-white pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* ── LEFT: TEXT CONTENT ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center max-w-2xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-lime-500"></span>
              </span>
              Est. 2016 · Rajkot, Gujarat
            </motion.div>

            <motion.h1 variants={itemVariants} className="mt-8 font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4rem]">
              Empowering lives, <br />
              <span className="text-accent italic">shaping futures.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-white/70">
              Real Human Trust is dedicated to uplifting underprivileged communities through quality education, accessible healthcare, and sustainable empowerment programs across India.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-lg transition-transform hover:-translate-y-1 hover:bg-accent/90"
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
                className="h-14 rounded-full border-white/20 bg-transparent px-8 text-base text-white transition-all hover:-translate-y-1 hover:bg-white/10"
              >
                <Link href="/signup">
                  Become a Member
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Quick Stats row */}
            <motion.div variants={itemVariants} className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                  <Users className="size-5 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-white">25,000+</p>
                  <p className="text-xs text-white/60">Lives Impacted</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                  <ShieldCheck className="size-5 text-lime-400" />
                </div>
                <div>
                  <p className="font-bold text-white">80G & 12A</p>
                  <p className="text-xs text-white/60">Govt. Certified</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: BENTO GRID (Animated) ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid h-[500px] sm:h-[600px] grid-cols-2 grid-rows-3 gap-4 lg:ml-auto w-full max-w-lg"
          >
            {/* Main Tall Image */}
            <motion.div
              variants={itemVariants}
              className="group relative row-span-3 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <Image
                src="/hero-community-education-india.png"
                alt="Education"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-bold text-white">Education for All</p>
                <p className="text-xs text-white/70">Building strong foundations</p>
              </div>
            </motion.div>

            {/* Top Right: Stat/Focus Card */}
            <motion.div
              variants={itemVariants}
              className="group relative flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-accent/20 to-accent/5 p-6"
            >
              <HandHeart className="size-8 text-accent mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white">Healthcare</h3>
              <p className="text-xs text-white/70 mt-1">Medical camps & support</p>
              
              {/* Decorative circle */}
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-accent/20 blur-xl transition-all group-hover:bg-accent/30" />
            </motion.div>

            {/* Bottom Right: Second Image */}
            <motion.div
              variants={itemVariants}
              className="group relative row-span-2 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"
            >
              <Image
                src="/community-health-camp-india.png"
                alt="Healthcare"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-bold text-white">Community Relief</p>
                <p className="text-xs text-white/70">Standing together</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
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
