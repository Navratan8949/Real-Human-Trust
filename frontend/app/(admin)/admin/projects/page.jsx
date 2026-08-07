"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"

const PROJECT_SCHEMA = [
  { name: "title", label: "Project Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "image", label: "Image", type: "file" },
  { name: "goalAmount", label: "Goal Amount (₹)", type: "number" },
  { name: "raisedAmount", label: "Raised Amount (₹)", type: "number" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Active", value: "active" },
      { label: "Completed", value: "completed" },
      { label: "Upcoming", value: "upcoming" }
    ],
    required: true
  },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  { name: "isFeatured", label: "Is Featured?", type: "boolean" }
]

const COLUMNS = [
  { 
    key: "image", 
    label: "Image", 
    render: (r) => r.image?.url ? <div className="relative h-10 w-16 overflow-hidden rounded-md border"><Image src={r.image.url} alt="" fill className="object-cover" /></div> : <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">No img</span> 
  },
  { key: "title", label: "Title" },
  { key: "goalAmount", label: "Goal (₹)" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "isFeatured", label: "Featured", render: (r) => r.isFeatured ? "Yes" : "No" }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Projects"
      description="Manage ongoing and past programs."
      endpoint="/projects"
      schema={PROJECT_SCHEMA}
      columns={COLUMNS}
    />
  )
}
