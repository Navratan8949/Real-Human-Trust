"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

export default function Page() {
  const schema = [
    { 
      name: "status", 
      label: "Status", 
      type: "select", 
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Resolved", value: "resolved" }
      ]
    }
  ]

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <AdminCrudPage
      title="Enquiries"
      description="Manage contact form submissions."
      endpoint="/contact"
      schema={schema}
      columns={columns}
      primaryAction={null} // Cannot create enquiries from admin panel
      hideDelete={true} // Enquiries should be resolved, not deleted
    />
  )
}
