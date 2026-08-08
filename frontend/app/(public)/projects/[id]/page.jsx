import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CheckCircle2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProjects, getProjectById } from "@/service/project.service"
import { CampaignCard } from "@/components/shared/campaign-card"

export async function generateStaticParams() {
  try {
    const data = await getProjects()
    if (data && data.success && data.projects) {
      return data.projects.map((p) => ({ id: p._id }))
    }
  } catch (error) {
    console.error("Failed to fetch projects for static params", error)
  }
  return []
}

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    const data = await getProjectById(id)
    return { title: data?.project?.title || data?.data?.title || "Project" }
  } catch (err) {
    return { title: "Project" }
  }
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params
  
  let project = null
  let campaigns = []
  try {
    const data = await getProjectById(id)
    if (data?.success) {
      project = data.project || data.data
    }
    
    // Fetch associated campaigns
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/crowdfunding`, { cache: 'no-store' })
    if (res.ok) {
      const cData = await res.json()
      if (cData.success && cData.campaigns) {
        campaigns = cData.campaigns.filter(c => c.project?._id === id || c.project === id)
      }
    }
  } catch (error) {
    console.error("Failed to fetch project details:", error)
  }

  if (!project) notFound()

  const imageUrl = project.image?.url || (typeof project.image === 'string' && project.image) ? (project.image?.url || project.image) : null

  const highlights = [
    "Transparent field updates for donors and members",
    "Local volunteers and partner schools involved",
    "Measurable outcomes tracked every quarter",
    "Aligned with trust education & welfare goals",
  ]

  return (
    <article>
      <div className="relative isolate min-h-[48vh] overflow-hidden bg-navy text-white">
        {imageUrl && <Image src={imageUrl} alt="" fill className="object-cover opacity-50" priority sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/40" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28">
          <Link href="/projects" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className="size-4" /> All projects
          </Link>
          <span className="inline-flex w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            {project.category} · {project.status}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">{project.description}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-navy">About this project</h2>
          <div className="mt-6 prose prose-lg prose-slate text-muted-foreground leading-relaxed">
            <p>{project.description}</p>
            <p>
              This initiative is designed for long-term community benefit — combining on-ground delivery with
              transparent reporting so donors and members can see where their support goes.
            </p>
          </div>
          
          <div className="mt-10">
            <h3 className="font-serif text-xl font-semibold text-navy mb-5">Key Highlights</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex gap-3 rounded-xl border border-border/60 bg-card px-4 py-4 text-sm shadow-soft">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-lime" />
                  <span className="font-medium text-foreground">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {campaigns.length > 0 && (
            <div className="mt-12 pt-10 border-t border-border/60">
              <h3 className="font-serif text-2xl font-semibold text-navy mb-6">Active Campaigns for this Project</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {campaigns.map(campaign => (
                  <CampaignCard key={campaign._id} campaign={campaign} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <aside className="sticky top-24 h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-soft md:p-8">
            <h3 className="font-serif text-xl font-semibold text-navy">Support this work</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your contribution funds field activities under this program.</p>
            
            {(project.goalAmount > 0 || project.raisedAmount > 0) && (
              <div className="mt-8 mb-6">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="text-navy">
                    ₹{(project.raisedAmount || 0).toLocaleString("en-IN")} / <span className="text-muted-foreground font-medium">₹{(project.goalAmount || 0).toLocaleString("en-IN")}</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div 
                    className="h-full rounded-full bg-accent transition-all duration-1000" 
                    style={{ width: `${Math.min(100, ((project.raisedAmount || 0) / (project.goalAmount || 1)) * 100)}%` }} 
                  />
                </div>
              </div>
            )}
            
            <Button asChild className="mt-4 h-12 w-full rounded-xl bg-accent text-base font-bold text-accent-foreground shadow-sm hover:bg-accent/90">
              <Link href={`/donate?projectId=${project._id}`}>
                <Heart className="mr-2 size-5" />
                Donate now
              </Link>
            </Button>
            
            <div className="mt-6 border-t border-border/60 pt-6 space-y-4">
              {project.startDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(project.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
              {project.endDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(project.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <Button asChild variant="outline" className="mt-6 h-11 w-full rounded-xl">
              <Link href="/signup">Register / Join Us</Link>
            </Button>
          </aside>
        </div>
      </div>
    </article>
  )
}
