"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

const volunteerSchema = [
  { name: "fullName", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "mobile", label: "Mobile Number", type: "text", required: true },
  { name: "address", label: "Address", type: "text" },
  { name: "message", label: "Message / Skills", type: "textarea" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    required: true,
    options: [
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" }
    ] 
  }
]

export default function Page() {
  return (
    <AdminCrudPage
      title="Volunteers"
      description="Manage all volunteer applications and registrations."
      endpoint="/volunteers"
      schema={volunteerSchema}
      columns={[
        { key: "fullName", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "message", label: "Message / Skills" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
      ]}
    />
  )
}

