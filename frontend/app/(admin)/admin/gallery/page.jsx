"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"

const CATEGORIES = ["Education", "Healthcare", "Environment", "Food & Nutrition", "Community", "Events"]

const GALLERY_SCHEMA = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { 
    name: "type", 
    label: "Media Type", 
    type: "select", 
    options: [
      { label: "Photo", value: "photo" },
      { label: "Video", value: "video" }
    ],
    required: true
  },
  { name: "image", label: "Image / Thumbnail (Optional)", type: "file" },
  { name: "videoUrl", label: "YouTube Embed URL (For Videos only)", type: "text" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: CATEGORIES.map(c => ({ label: c, value: c })),
  },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" }
    ],
    required: true
  }
]

const COLUMNS = [
  { 
    key: "image", 
    label: "Image", 
    render: (r) => r.image?.url ? <div className="relative h-10 w-16 overflow-hidden rounded-md border"><Image src={r.image.url} alt="" fill className="object-cover" /></div> : <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">No img</span> 
  },
  { key: "title", label: "Title" },
  { key: "type", label: "Type", render: (r) => <span className="capitalize">{r.type}</span> },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Gallery"
      description="Manage photos and videos across different categories."
      endpoint="/gallery"
      schema={GALLERY_SCHEMA}
      columns={COLUMNS}
    />
  )
}
