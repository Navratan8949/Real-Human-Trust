"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Award, Bell, CalendarDays, ClipboardList, Download, FileBadge, FileText, FolderKanban, ImageIcon, IndianRupee, LayoutDashboard, LogOut, Mail, MessageSquare, Newspaper, Settings, ShieldCheck, Target, UserCircle2, UserPlus, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import { canAccessAdminPath } from "@/lib/admin-permissions"

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/staff", label: "Staff", icon: ShieldCheck },
  { href: "/admin/users", label: "Registered Users", icon: UserCircle2 },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/donations", label: "Donations", icon: IndianRupee },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/crowdfunding", label: "Campaigns", icon: Target },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/volunteers", label: "Volunteers", icon: UserPlus },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/admin/contact", label: "Enquiries", icon: Mail },
  { href: "/admin/team", label: "Team", icon: UserCircle2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/awards", label: "Awards", icon: Award },
  { href: "/admin/reports", label: "Reports", icon: ClipboardList },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/certificates", label: "Certificates", icon: FileBadge },
  { href: "/admin/appointments", label: "Appointments", icon: FileText },
  { href: "/admin/newsletter", label: "Newsletter", icon: Bell },
  { href: "/admin/site-content", label: "Site Content", icon: Settings },
  { href: "/admin/backup", label: "Backup", icon: ShieldCheck },
]

export function getAllowedAdminNav(user) {
  return ADMIN_NAV.filter((item) => canAccessAdminPath(item.href, user))
}

import { useState, useEffect } from "react"
import api from "@/service/api"

export function AdminNavLinks({ user, onNavigate, className }) {
  const pathname = usePathname()
  const [badges, setBadges] = useState({})

  useEffect(() => {
    let isMounted = true
    api.get("/dashboard/stats")
      .then((res) => {
        if (!isMounted) return
        const alerts = res.data?.stats?.actionableAlerts || {}
        setBadges({
          "/admin/members": alerts.pendingMembers?.count || 0,
          "/admin/donations": alerts.pendingDonations?.count || 0,
          "/admin/volunteers": alerts.pendingVolunteers?.count || 0,
          "/admin/complaints": alerts.openComplaints?.count || 0,
        })
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  return getAllowedAdminNav(user).map((item) => {
    const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/")
    const Icon = item.icon
    const count = badges[item.href] || 0

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition group", active ? "bg-white/15 font-semibold text-white" : "text-white/65 hover:bg-white/10 hover:text-white", className)}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate flex-1">{item.label}</span>
        {count > 0 && (
          <span className={cn(
            "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold shadow-sm animate-pulse",
            item.href === "/admin/members" ? "bg-amber-400 text-slate-950" :
            item.href === "/admin/complaints" ? "bg-rose-500 text-white" :
            "bg-emerald-400 text-slate-950"
          )}>
            {count}
          </span>
        )}
      </Link>
    )
  })
}

export function AdminSidebar() {
  const user = useSelector(selectUser)

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy text-white lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin"><p className="font-serif text-lg font-bold">Real Human Trust</p><p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/50">Admin Panel</p></Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <AdminNavLinks user={user} />
      </nav>
      <div className="border-t border-white/10 p-3"><Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/10 hover:text-white"><LogOut className="size-4" />Back to website</Link></div>
    </aside>
  )
}
