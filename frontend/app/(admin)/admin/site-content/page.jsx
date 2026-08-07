"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
const ROWS = [{"_id": "1", "key": "founder_message", "title": "Founder's Message"}]
export default function Page() {
  return (
    <AdminCrudPage
      title="Site Content"
      description="Static pages"
      endpointHint="CRUD /site-content"
      rows={ROWS}
      columns={[{ key: "key", label: "Key" }, { key: "title", label: "Title" }, { key: "actions", label: "Actions", render: () => (<div className="flex gap-2 text-xs font-semibold"><button type="button" className="text-navy hover:underline">View</button><button type="button" className="text-emerald-600 hover:underline">Approve</button></div>) }]}
    />
  )
}
