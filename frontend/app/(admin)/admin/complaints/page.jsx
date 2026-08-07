"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"

export default function Page() {
  const schema = [
    { name: "reply", label: "Admin Reply", type: "textarea", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in_progress" },
        { label: "Resolved", value: "resolved" },
        { label: "Closed", value: "closed" }
      ]
    }
  ]

  const columns = [
    { key: "member", label: "Member Name", render: (r) => r.member?.user?.fullName || "Unknown" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "reply", label: "Reply" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <AdminCrudPage
      title="Member Complaints"
      description="View and resolve complaints raised by registered members."
      endpoint="/complaints"
      schema={schema}
      columns={columns}
      primaryAction={null} // Disable creation from admin
      hideDelete={true} // Complaints should only be resolved, not deleted
      disableActions={(row) => row.status === "closed"} // cannot edit if closed
    />
  )
}
