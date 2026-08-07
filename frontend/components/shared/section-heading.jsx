export function SectionHeading({ eyebrow, title, description, align = "center", className = "" }) {
  const alignCls = align === "left" ? "text-left items-start" : "text-center items-center mx-auto"
  return (
    <div className={`flex max-w-2xl flex-col ${alignCls} ${className}`}>
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
          <span className="size-1.5 rounded-full bg-lime" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
