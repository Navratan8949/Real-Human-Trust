import Image from "next/image"
import Link from "next/link"
import { SITE } from "@/constants/site"

export function Logo({ variant = "dark", showText = true, className = "" }) {
  const textColor = variant === "light" ? "text-navy-foreground" : "text-foreground"
  const subColor = variant === "light" ? "text-navy-foreground/70" : "text-muted-foreground"

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label={`${SITE.shortName} home`}>
      {/* <span className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-card shadow-sm ring-1 ring-border"> */}
      <Image
        src={SITE.logo || "/placeholder.svg"}
        alt={`${SITE.shortName} logo`}
        width={400}
        height={400}
        className="size-25 object-contain"
        priority
      />
      {/* </span> */}
      {showText && (
        <span className="notranslate flex flex-col leading-tight">
          <span className={`font-serif text-base font-bold tracking-tight ${textColor}`}>Real Human</span>
          <span className={`text-[10px] font-medium uppercase tracking-[0.14em] ${subColor}`}>
            Education & Charitable Trust
          </span>
        </span>
      )}
    </Link>
  )
}
