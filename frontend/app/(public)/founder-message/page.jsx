import { PageHero } from "@/components/pages/page-hero"
import { FounderMessageSection } from "@/components/sections/founder-message"

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

      <FounderMessageSection />
    </>
  )
}
