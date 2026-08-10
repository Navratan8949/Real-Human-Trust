"use client"

import { HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchSiteContent } from "@/redux/features/siteContentSlice"

const DEFAULT_FAQS = [
  {
    q: "How can I donate to Real Human Trust?",
    a: "You can securely donate online using UPI, Credit/Debit cards, or Net Banking through our Donate page. We also accept direct bank transfers (NEFT/RTGS/IMPS).",
  },
  {
    q: "Are my donations tax-exempted under 80G?",
    a: "Yes, all donations made to Real Human Education & Charitable Trust are eligible for a 50% tax deduction under Section 80G of the Income Tax Act. You will automatically receive an 80G receipt on your email upon successful donation and verification.",
  },
  {
    q: "Where does the organization operate?",
    a: "We are based in Rajkot, Gujarat, and our primary focus areas include rural regions and underdeveloped communities across Gujarat, focusing on education, healthcare, and women empowerment.",
  },
  {
    q: "How can I volunteer or become a member?",
    a: "We welcome passionate individuals! You can join us by filling out the Volunteer form on our website, or by opting for one of our Membership plans (Basic, Premium, or Lifetime) to actively participate in our core decisions and events.",
  },
  {
    q: "How do you ensure transparency in fund utilization?",
    a: "Transparency is our core value. We regularly publish Annual Reports and audit statements which are accessible on our website. Every major project's financial breakdown is shared with our donors and lifetime members.",
  },
]

export function FaqSection() {
  const dispatch = useDispatch()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  let faqs = DEFAULT_FAQS
  if (siteContent?.faqs?.content) {
    try {
      faqs = JSON.parse(siteContent.faqs.content)
    } catch (e) { }
  }

  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
      {/* Decorative background elements */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(147,224,24,0.05),transparent_50%)]"></div>
      <div className="absolute right-0 bottom-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(25,76,143,0.05),transparent_50%)]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left Column - Sticky Heading */}
          <div className="lg:sticky lg:top-16 lg:h-max">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy shadow-sm">
              <HelpCircle className="size-4 text-accent" />
              Have Questions?
            </div>
            <h2 className="font-serif text-3xl font-bold text-navy sm:text-4xl lg:text-5xl lg:leading-tight">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-accent">Questions</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Find answers to common questions about our organization, donations, tax exemptions, and how you can get involved.
            </p>
            {/* <div className="mt-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <p className="font-semibold text-foreground">Still have questions?</p>
              <p className="mt-1 text-sm text-muted-foreground">We're here to help you understand our mission better.</p>
              <Button asChild className="mt-4 w-full rounded-xl bg-navy font-bold hover:bg-navy/90 text-white">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div> */}
          </div>

          {/* Right Column - Accordion */}
          <div className="rounded-3xl border border-border/50 bg-white p-6 shadow-xl shadow-navy/5 sm:p-8">
            <Accordion type="single" className="w-full" defaultValue="item-0">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b-border/40 py-2 last:border-0"
                >
                  <AccordionTrigger className="text-left text-[15px] font-bold text-navy hover:text-accent transition-colors py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-4">
                    <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.a }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
