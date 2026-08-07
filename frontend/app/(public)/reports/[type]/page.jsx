import { Download, FileText } from "lucide-react"
import { PageHero } from "@/components/pages/page-hero"
import { Button } from "@/components/ui/button"
import { getReports } from "@/service/report.service"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const type = params.type || "annual"
  const title = type === "annual" ? "Annual Reports" : type === "audit" ? "Audit Reports" : "Reports"
  return { title }
}

export default async function Page({ params }) {
  const type = params.type || "annual"
  const title = type === "annual" ? "Annual Reports" : type === "audit" ? "Audit Reports" : "Reports"
  const description = type === "annual" ? "A comprehensive summary of our activities, achievements, and impact." : "Financial statements and compliance documents."
  
  let reports = []
  try {
    const data = await getReports({ type })
    if (data?.success) {
      reports = data.data || data.reports || []
      // filter if api doesn't support query params (just in case)
      reports = reports.filter(r => r.type === type && r.status === 'active')
    }
  } catch (error) {
    console.error(`Failed to fetch ${type} reports:`, error)
  }

  // sort by year descending
  reports.sort((a, b) => (b.year || 0) - (a.year || 0))

  return (
    <>
      <PageHero eyebrow="Resources" title={title} description={description} image="/about-volunteers-india.png" />
      
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {reports.length > 0 ? (
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            {reports.map((report) => (
              <div key={report._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-navy">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <span className="font-medium">{report.title}</span>
                    {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
                  </div>
                </div>
                {report.pdf?.url && (
                  <Button asChild variant="outline" size="sm" className="shrink-0 rounded-lg">
                    <a href={report.pdf.url} target="_blank" rel="noreferrer">
                      <Download className="mr-2 size-4" />
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-secondary/30">
            <FileText className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No reports available</h3>
            <p className="text-sm text-muted-foreground mt-1">We haven't uploaded any {type} reports yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  )
}
