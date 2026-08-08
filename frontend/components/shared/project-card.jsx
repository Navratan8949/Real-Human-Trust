import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project._id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-navy/5 border border-border/50
       transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40
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
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3 className="font-serif text-2xl font-bold leading-snug text-navy group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="mt-3 flex-1 line-clamp-2 text-base leading-relaxed text-muted-foreground font-medium">{project.description}</p>
          
          {(project.goalAmount > 0 || project.raisedAmount > 0) && (
            <div className="mt-6 rounded-xl bg-[#faf9f6] p-4 border border-border/40">
              <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-muted-foreground">Raised</span>
                <span className="text-navy">₹{(project.raisedAmount || 0).toLocaleString("en-IN")} / ₹{(project.goalAmount || 1).toLocaleString("en-IN")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border/50">
                <div 
                  className="h-full rounded-full bg-accent transition-all duration-1000" 
                  style={{ width: `${Math.min(100, ((project.raisedAmount || 0) / (project.goalAmount || 1)) * 100)}%` }} 
                />
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-border/40 pt-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-navy transition-colors group-hover:text-accent">
              View project
              <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
