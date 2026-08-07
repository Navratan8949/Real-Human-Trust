"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const eventSchema = [
  { name: "title", label: "Event Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "location", label: "Location", type: "text", required: true },
  { name: "eventDate", label: "Event Date", type: "date", required: true },
  { name: "registrationLastDate", label: "Registration Last Date", type: "date" },
  { name: "maxParticipants", label: "Max Participants", type: "number" },
  { name: "image", label: "Event Image", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select",
    options: [
      { label: "upcoming", value: "upcoming" },
      { label: "ongoing", value: "ongoing" },
      { label: "completed", value: "completed" },
      { label: "cancelled", value: "cancelled" }
    ],
    required: true
  }
]

export default function EventsAdminPage() {
  return (
    <AdminCrudPage
      title="Events"
      description="Manage upcoming, ongoing, and past events."
      endpoint="/events"
      schema={eventSchema}
      customActions={(item) => (
        <Button asChild variant="outline" size="sm" className="h-8 ml-2">
          <Link href={`/admin/events/${item._id}/registrations`}>
            Registrations
          </Link>
        </Button>
      )}
      columns={[
        { 
          key: "image", 
          label: "Image", 
          render: (row) => row.image?.url ? (
            <img src={row.image.url} alt={row.title} className="h-10 w-14 object-cover rounded-md border border-border" />
          ) : (
            <div className="h-10 w-14 bg-secondary flex items-center justify-center text-[10px] rounded-md text-muted-foreground border border-border">No img</div>
          )
        },
        { key: "title", label: "Title", render: (r) => <div className="font-semibold text-navy max-w-[200px] truncate">{r.title}</div> },
        { key: "location", label: "Location", render: (r) => <div className="text-xs truncate max-w-[150px]">{r.location}</div> },
        { 
          key: "eventDate", 
          label: "Event Date", 
          render: (r) => r.eventDate ? new Date(r.eventDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"
        },
        { 
          key: "status", 
          label: "Status", 
          render: (r) => {
            const map = {
              upcoming: "bg-blue-50 text-blue-700 border-blue-200",
              ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
              completed: "bg-slate-100 text-slate-700 border-slate-300",
              cancelled: "bg-rose-50 text-rose-700 border-rose-200"
            }
            const cls = map[r.status] || map.upcoming
            return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cls}`}>{r.status}</span>
          }
        }
      ]}
    />
  )
}
