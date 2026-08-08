"use client"

import { Reveal } from "@/components/shared/reveal"
import { Quote } from "lucide-react"

export function ParallaxBanner() {
  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
      {/* 
        The bg-fixed class is what creates the parallax effect in CSS. 
        As the user scrolls the page, the background image stays fixed in place, 
        giving a window-like effect.
      */}
      <div
        className="absolute inset-0 bg-[url('/rural-classroom-children-learning-india.png')] bg-cover bg-center bg-no-repeat bg-fixed"
      />

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#0a1628]/85" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 text-center text-white">
        <Reveal>
          <Quote className="mx-auto mb-8 size-14 text-accent/60 md:size-16" />
          <h2 className="font-serif text-3xl font-bold leading-snug sm:text-4xl md:text-5xl md:leading-tight">
            "We make a living by what we get, but we make a life by what we give."
          </h2>
          <p className="mt-8 font-sans text-lg font-semibold tracking-wider text-accent uppercase">
            — Winston Churchill
          </p>
        </Reveal>
      </div>
    </section>
  )
}
