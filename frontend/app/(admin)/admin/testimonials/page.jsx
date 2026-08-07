"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"
import { Star } from "lucide-react"

const testimonialSchema = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "designation", label: "Designation / Role", type: "text", required: false },
  { name: "message", label: "Message", type: "textarea", required: true },
  { 
    name: "rating", 
    label: "Rating (1 to 5)", 
    type: "number", 
    required: true,
  },
  { name: "image", label: "Profile Image (Optional)", type: "file" },
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
      title="Testimonials"
      description="Manage all community and beneficiary testimonials."
      endpoint="/testimonials"
      schema={testimonialSchema}
      columns={[
        { 
          key: "image", 
          label: "Image", 
          render: (r) => r.image?.url ? <div className="relative h-10 w-10 overflow-hidden rounded-full border"><Image src={r.image.url} alt="" fill className="object-cover" /></div> : <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">No img</span> 
        },
        { key: "name", label: "Name" },
        { key: "designation", label: "Designation" },
        { 
          key: "rating", 
          label: "Rating",
          render: (r) => (
            <div className="flex items-center gap-1">
              <span className="font-semibold">{r.rating}</span>
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
            </div>
          )
        },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
      ]}
    />
  )
}
