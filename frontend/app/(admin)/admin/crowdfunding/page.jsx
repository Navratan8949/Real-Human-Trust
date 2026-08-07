"use client"
import { useState, useEffect } from "react"
import { AdminCrudPage, StatusBadge } from "@/components/admin/crud-page"
import { getProjects } from "@/service/project.service"

export default function Page() {
  const [projectOptions, setProjectOptions] = useState([])

  useEffect(() => {
    // Fetch projects to populate the Project Dropdown
    getProjects().then(res => {
      if (res.success && res.projects) {
        setProjectOptions(res.projects.map(p => ({ label: p.title, value: p._id })))
      }
    }).catch(console.error)
  }, [])

  const schema = [
    { name: "title", label: "Campaign Title", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "project", label: "Associated Project", type: "select", options: projectOptions, required: true },
    { name: "targetAmount", label: "Target Amount (₹)", type: "number", required: true },
    { name: "raisedAmount", label: "Raised Amount (₹)", type: "number", required: false },
    { name: "startDate", label: "Start Date", type: "date", required: false },
    { name: "endDate", label: "End Date", type: "date", required: false },
    { name: "status", label: "Status", type: "select", required: true, options: [
      { label: "Active", value: "active" },
      { label: "Completed", value: "completed" },
      { label: "Closed", value: "closed" }
    ]},
    { name: "image", label: "Campaign Image", type: "file", required: false }
  ]

  const columns = [
    { key: "image", label: "Image", render: (r) => r.image?.url ? <img src={r.image.url} className="w-10 h-10 object-cover rounded-md" /> : "No Image" },
    { key: "title", label: "Title" },
    { key: "project", label: "Project", render: (r) => r.project?.title || "N/A" },
    { key: "targetAmount", label: "Target", render: (r) => `₹${r.targetAmount?.toLocaleString("en-IN")}` },
    { key: "raisedAmount", label: "Raised", render: (r) => `₹${r.raisedAmount?.toLocaleString("en-IN")}` },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> }
  ]

  return (
    <AdminCrudPage
      title="Campaigns"
      description="Manage crowdfunding campaigns and track donations."
      endpoint="/crowdfunding"
      schema={schema}
      columns={columns}
    />
  )
}
