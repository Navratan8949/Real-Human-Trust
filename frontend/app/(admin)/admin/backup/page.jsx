"use client"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
const ROWS = [{"_id": "1", "file": "backup.json", "size": "2.4 MB"}]
export default function Page() {
  return (
    <AdminCrudPage
      title="Backup"
      description="Super admin export"
      endpointHint="GET /admin/backup"
      rows={ROWS}
      columns={[{ key: "file", label: "File" }, { key: "size", label: "Size" }, { key: "actions", label: "Actions", render: () => (<div className="flex gap-2 text-xs font-semibold"><button type="button" className="text-navy hover:underline">View</button><button type="button" className="text-emerald-600 hover:underline">Approve</button></div>) }]}
    />
  )
}
