import Image from "next/image"
export function PageHero({ eyebrow, title, description, image }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/50">
      {image && (<>
        <div className="absolute inset-0 -z-10"><Image src={image} alt="" fill className="object-cover" sizes="100vw" priority loading="eager" /></div>
        <div className="absolute inset-0 -z-10 bg-navy/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/40 via-navy/70 to-[#0a1628]" />
      </>)}
      <div className={`mx-auto max-w-7xl px-4 ${image ? "py-16 text-white md:py-20" : "py-12 md:py-16"}`}>
        <div className="max-w-3xl">
          {eyebrow && <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${image ? "border border-white/20 bg-white/10 text-amber-300" : "bg-accent/15 text-navy"}`}><span className="size-1.5 rounded-full bg-lime" />{eyebrow}</span>}
          <h1 className={`mt-4 font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl ${image ? "text-white" : "text-foreground"}`}>{title}</h1>
          {description && <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${image ? "text-white/75" : "text-muted-foreground"}`}>{description}</p>}
        </div>
      </div>
    </section>
  )
}
