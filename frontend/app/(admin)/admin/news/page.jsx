"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"

const NEWS_SCHEMA = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Content / Description", type: "textarea", required: true },
  { name: "image", label: "Cover Image (Optional)", type: "file" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: [
      { label: "News", value: "news" },
      { label: "Press Release", value: "press_release" }
    ],
    required: true
  },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" }
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
  { key: "category", label: "Category", render: (r) => <span className="capitalize">{r.category?.replace("_", " ")}</span> },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "publishedAt", label: "Published Date", render: (r) => new Date(r.publishedAt || r.createdAt).toLocaleDateString() }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="News & Press"
      description="Manage news articles and press releases."
      endpoint="/news"
      schema={NEWS_SCHEMA}
      columns={COLUMNS}
    />
  )
}
