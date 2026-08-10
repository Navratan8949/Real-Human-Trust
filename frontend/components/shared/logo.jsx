import Image from "next/image"
import Link from "next/link"
import { SITE } from "@/constants/site"

export function Logo({ variant = "dark", showText = true, className = "" }) {
  const textColor = variant === "light" ? "text-navy-foreground" : "text-foreground"
  const subColor = variant === "light" ? "text-navy-foreground/70" : "text-muted-foreground"

  return (
    <Link href="/" className={`flex items-center gap-2 sm:gap-3 shrink-0 ${className}`} aria-label={`${SITE.shortName} home`}>
      <Image
        src={SITE.logo || "/placeholder.svg"}
        alt={`${SITE.shortName} logo`}
        width={400}
        height={400}
        className="size-12 sm:size-16 shrink-0 object-contain"
        priority
      />
      {showText && (
        <span className="notranslate flex flex-col leading-tight min-w-0">
          <span className={`font-serif text-sm sm:text-base font-bold tracking-tight ${textColor} truncate`}>Real Human</span>
          <span className={`text-[9px] sm:text-[10px] font-medium uppercase tracking-wider sm:tracking-[0.14em] ${subColor} truncate`}>
            Education & Charitable Trust
          </span>
        </span>
      )}
    </Link>
  )
}
