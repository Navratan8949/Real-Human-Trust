import Image from "next/image"
import { Quote, Star } from "lucide-react"

export function TestimonialCard({ item }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="absolute right-5 top-5 text-primary/15">
        <Quote className="size-12" />
      </div>

      <div className="mb-5 flex items-center gap-3">
        <Image
          src={item.image?.url || item.image || "/placeholder-user.jpg"}
          alt={item.name}
          width={60}
          height={60}
          className="size-14 rounded-full border object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {item.designation || item.role || "Supporter"}
          </span>
        </div>
      </div>

      <p className="flex-1 leading-8 text-muted-foreground">
        "{item.message}"
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex gap-1">
          {[...Array(item.rating || 5)].map((_, i) => (
            <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Verified
        </span>
      </div>
    </div>
  )
}
