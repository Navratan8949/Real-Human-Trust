"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import api from "@/service/api"
import { toast } from "sonner"

export default function Page() {
  const schema = [
    { name: "fullName", label: "Donor Name", required: true },
    { name: "email", label: "Email", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "paymentMethod", label: "Payment Method", type: "select", options: [
      { label: "Online", value: "online" },
      { label: "UPI", value: "upi" },
      { label: "Bank Transfer", value: "bank" },
      { label: "Cash", value: "cash" }
    ], required: true },
    { name: "paymentStatus", label: "Payment Status", type: "select", options: [
      { label: "Pending", value: "pending" },
      { label: "Verified / Success", value: "verified" },
      { label: "Rejected / Failed", value: "rejected" }
    ], required: true },
    { name: "purpose", label: "Purpose" }
  ]

  const columns = [
    { key: "donor", label: "Donor", render: (r) => (
      <div>
        <p className="font-semibold">{r.fullName}</p>
        <p className="text-xs text-muted-foreground">{r.email}</p>
      </div>
    ) },
    { key: "amount", label: "Amount", render: (r) => `₹${r.amount?.toLocaleString("en-IN")}` },
    { key: "cause", label: "Cause", render: (r) => {
      if (r.campaign) return <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">Campaign: {r.campaign.title}</span>
      if (r.project) return <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Project: {r.project.title}</span>
      return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-semibold">{r.purpose || "General"}</span>
    } },
    { key: "mode", label: "Mode", render: (r) => (
      <span className="uppercase text-xs font-bold text-navy">{r.paymentMethod}</span>
    ) },
    { key: "status", label: "Status", render: (r) => (
      <StatusBadge status={r.paymentStatus === 'success' ? 'verified' : r.paymentStatus} />
    ) }
  ]

  const verifyDonation = async (id, crud) => {
    try {
      await api.put(`/donations/${id}/verify`, { status: "verified" })
      toast.success("Donation verified successfully")
      crud.fetchAll()
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed")
    }
  }

  const actionButtons = (r, crud, permissions) => (
    permissions.canEdit ? (
      <div className="flex items-center gap-2">
        {r.paymentStatus === "pending" && (
          <button 
            onClick={() => verifyDonation(r._id, crud)}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            Verify
          </button>
        )}
      </div>
    ) : null
  )

  return (
    <AdminCrudPage
      title="Donations"
      description="Manage all donations (Online & Manual). Verify manual donations to trigger receipts and update progress bars."
      endpoint="/donations"
      schema={schema}
      columns={columns}
      customActions={actionButtons}
      hideDelete={true} // Replaced by custom actions
      hideEdit={true}
    />
  )
}
