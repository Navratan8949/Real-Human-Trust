import { Hero } from "@/components/sections/hero"
import { TrustStrip } from "@/components/sections/trust-strip"
import { ImpactStats } from "@/components/sections/impact-stats"
import { AboutPreview } from "@/components/sections/about-preview"
import { TextMaskBanner } from "@/components/sections/text-mask-banner"
import { FocusAreas } from "@/components/sections/focus-areas"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { FeaturedCampaign } from "@/components/sections/featured-campaign"
import { UpcomingEvents } from "@/components/sections/upcoming-events"
import { Testimonials } from "@/components/sections/testimonials"
import { CtaBand } from "@/components/sections/cta-band"
import { LatestUpdates } from "@/components/sections/latest-updates"
import { GalleryPreview } from "@/components/sections/gallery-preview"
import { NewsletterBand } from "@/components/sections/newsletter-band"
import { ParallaxBanner } from "@/components/sections/parallax-banner"
import { FaqSection } from "@/components/sections/faq-section"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      {/* 1. Hook */}
      <Hero />

      {/* 2. Introduction: Who We Are */}
      <AboutPreview />

      {/* 3. Emotional Visual Breaker */}
      <TextMaskBanner />

      {/* 4. What We Do: Core Pillars */}
      <FocusAreas />

      {/* 5. Action: Urgent Need */}
      <FeaturedCampaign />

      {/* 6. Proof of Work: Past/Current Successes */}
      <FeaturedProjects />

      {/* 7. Visual Breaker */}
      <ParallaxBanner />

      {/* 8. Activity: Ongoing efforts and news */}
      <UpcomingEvents />
      <LatestUpdates />

      {/* 9. Trust & Community Validation */}
      <Testimonials />

      {/* 10. Visual Proof */}
      <GalleryPreview />

      {/* 11. FAQ Section */}
      <FaqSection />

      {/* 12. Final Push */}
      <NewsletterBand />
      {/* <CtaBand /> */}
    </>
  )
}
