"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import Image from "next/image"

const TEAM_SCHEMA = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "designation", label: "Designation", type: "text", required: true },
  { name: "email", label: "Email (Optional)", type: "email" },
  { name: "phone", label: "Phone (Optional)", type: "text" },
  { name: "website", label: "Website / Social Link (Optional)", type: "text" },
  { name: "photo", label: "Photo (Optional)", type: "file" },
  { name: "order", label: "Display Order", type: "number" },
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
    key: "photo", 
    label: "Photo", 
    render: (r) => r.photo?.url ? <div className="relative h-10 w-10 overflow-hidden rounded-full border"><Image src={r.photo.url} alt="" fill className="object-cover" /></div> : <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">No img</span> 
  },
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Team"
      description="Manage the management team and leadership members."
      endpoint="/team"
      schema={TEAM_SCHEMA}
      columns={COLUMNS}
    />
  )
}
