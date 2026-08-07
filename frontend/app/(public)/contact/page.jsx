import { Mail, MapPin, Phone, ArrowRight } from "lucide-react"
import { ContactForm } from "@/components/forms/contact-form"
import { SITE } from "@/constants/site"
import { Reveal } from "@/components/shared/reveal"

export const metadata = { title: "Contact Us" }

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-navy/5 blur-[100px]" />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          
          {/* Left Column: Contact Information */}
          <Reveal className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
              <span className="size-1.5 rounded-full bg-lime" />
              Let's Connect
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-navy md:text-5xl lg:text-6xl">
              Get in touch with us.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Whether you have a question about our campaigns, want to volunteer, or simply want to learn more about our mission, our team is ready to answer all your questions.
            </p>

            <div className="mt-12 space-y-8">
              {/* Address Card */}
              <div className="group flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy/5 text-navy transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Head Office</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{SITE.address}</p>
                  <a href={SITE.maps} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center text-sm font-bold text-navy hover:text-accent">
                    Get Directions <ArrowRight className="ml-1 size-4" />
                  </a>
                </div>
              </div>

              <div className="h-px w-full bg-border/50" />

              {/* Phone Card */}
              <div className="group flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy/5 text-navy transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Phone</h3>
                  <p className="mt-2 text-muted-foreground">Mon-Sat from 9am to 6pm.</p>
                  <div className="mt-2 flex flex-col gap-1">
                    {SITE.phones.map(phone => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="text-base font-medium text-navy hover:text-accent">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-border/50" />

              {/* Email Card */}
              <div className="group flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy/5 text-navy transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email</h3>
                  <p className="mt-2 text-muted-foreground">We usually respond within 24 hours.</p>
                  <a href={`mailto:${SITE.email}`} className="mt-2 block text-base font-medium text-navy hover:text-accent">
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Contact Form */}
          <Reveal delay={0.2} className="relative">
            {/* Form Background Card */}
            <div className="relative rounded-[2rem] border border-border bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] sm:p-12">
              <div className="mb-10">
                <h2 className="font-serif text-3xl font-bold text-navy">Send a Message</h2>
                <p className="mt-2 text-muted-foreground">We'll get back to you as soon as possible.</p>
              </div>
              
              <ContactForm />
              
            </div>
          </Reveal>

        </div>
      </section>
    </div>
  )
}
