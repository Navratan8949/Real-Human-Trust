import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project._id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft
       transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lift
       ">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted flex items-center justify-center">
          {(project.image?.url || (typeof project.image === 'string' && project.image)) ? (
            <Image
              src={project.image?.url || project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <span className="text-muted-foreground font-serif">No Image</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {project.category && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground hover:bg-accent">
              {project.category}
            </Badge>
          )}
          {/* {project.status && (
            <span
              className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
                project.status === "active"
                  ? "bg-navy text-navy-foreground"
                  : "bg-card text-muted-foreground ring-1 ring-border"
              }`}
            >
              {project.status}
            </span>
          )} */}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-navy">
            {project.title}
          </h3>
          <p className="mt-2 flex-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          
          {(project.goalAmount > 0 || project.raisedAmount > 0) && (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Raised</span>
                <span className="text-navy">₹{(project.raisedAmount || 0).toLocaleString("en-IN")} / ₹{(project.goalAmount || 1).toLocaleString("en-IN")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-accent transition-all duration-1000" 
                  style={{ width: `${Math.min(100, ((project.raisedAmount || 0) / (project.goalAmount || 1)) * 100)}%` }} 
                />
              </div>
            </div>
          )}

          <div className="mt-5 border-t border-border/50 pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-accent">
              View project
              <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
