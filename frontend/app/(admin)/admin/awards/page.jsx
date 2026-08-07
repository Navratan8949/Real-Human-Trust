"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"

const awardSchema = [
  { name: "title", label: "Award Title", type: "text", required: true },
  { name: "awardedBy", label: "Awarded By", type: "text", required: false },
  { name: "year", label: "Year", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea", required: false },
  { name: "image", label: "Award Image (Optional)", type: "file" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ] 
  }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Awards"
      description="Manage all awards and certificates received by the Trust."
      endpoint="/awards"
      schema={awardSchema}
      columns={[
        { 
          key: "image", 
          label: "Image", 
          render: (r) => r.image?.url ? <div className="relative h-10 w-16 overflow-hidden rounded border"><Image src={r.image.url} alt="" fill className="object-cover" /></div> : <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">No img</span> 
        },
        { key: "title", label: "Title" },
        { key: "awardedBy", label: "Awarded By" },
        { key: "year", label: "Year" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
      ]}
    />
  )
}
