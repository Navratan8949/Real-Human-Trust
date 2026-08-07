import { PageHero } from "@/components/pages/page-hero"
import { ContentSections } from "@/components/pages/content-sections"
import { ImpactStats } from "@/components/sections/impact-stats"
import { FocusAreas } from "@/components/sections/focus-areas"
import { CtaBand } from "@/components/sections/cta-band"

export const metadata = { title: "About Us" }

const aboutSections = [
  [
    "Our Story",
    "Real Human Education & Charitable Trust began with a simple but profound belief: every individual, regardless of their background, deserves access to quality education, proper healthcare, and the opportunity to live with dignity. Based in Rajkot, Gujarat, we have grown from a small group of passionate volunteers into a structured, community-driven NGO that actively addresses the most pressing needs of underprivileged families.",
  ],
  [
    "Our Approach",
    "We believe in practical, on-the-ground interventions. Whether it is distributing school supplies to children who cannot afford them, setting up mobile health camps in remote villages, or providing vocational training for women, our approach is always direct, transparent, and measurable. We do not just provide temporary relief; we strive to create sustainable ecosystems where communities can eventually thrive independently.",
  ],
  [
    "Transparency & Trust",
    "Trust is the foundation of everything we do. As a registered charitable trust, we maintain absolute transparency with our donors and members. Every rupee contributed goes directly into our field programs, and we regularly publish audit reports and field updates. When you support Real Human Trust, you know exactly whose life you are changing.",
  ],
]

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Real work for education, dignity and community care."
        description="A Rajkot-based charitable trust serving children and families through actionable, on-the-ground welfare programs."
        image="/about-volunteers-india.png"
      />
      <ContentSections
        image="/about-volunteers-india.png"
        stats={["Gujarat Based", "Public Welfare", "Volunteer Powered"]}
        sections={aboutSections}
      />
      <ImpactStats />
      <FocusAreas />
      {/* <CtaBand /> */}
    </>
  )
}
