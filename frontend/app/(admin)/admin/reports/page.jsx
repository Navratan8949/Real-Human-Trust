"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

const REPORT_SCHEMA = [
  { name: "title", label: "Report Title", type: "text", required: true },
  { 
    name: "type", 
    label: "Report Type", 
    type: "select", 
    options: [
      { label: "Annual Report", value: "annual" },
      { label: "Audit Report", value: "audit" },
      { label: "Activity Report", value: "activity" },
      { label: "Financial Report", value: "financial" }
    ],
    required: true
  },
  { name: "year", label: "Year (e.g. 2024)", type: "number", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "pdf", label: "PDF File", type: "file" },
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
  { key: "title", label: "Title" },
  { key: "type", label: "Type", render: (r) => <span className="capitalize">{r.type}</span> },
  { key: "year", label: "Year" },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { 
    key: "pdf", 
    label: "Document", 
    render: (r) => r.pdf?.url ? (
      <a href={r.pdf.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-navy hover:underline">
        View PDF
      </a>
    ) : (
      <span className="text-xs text-muted-foreground">No file</span>
    )
  }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Reports"
      description="Manage Annual, Audit, and Financial Reports."
      endpoint="/reports"
      schema={REPORT_SCHEMA}
      columns={COLUMNS}
    />
  )
}
