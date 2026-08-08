"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CalendarDays, FileBadge, FileText, IdCard, IndianRupee, LogOut, MessageSquare, UserCircle2, Loader2, LayoutDashboard, Menu } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, selectIsAuthenticated, selectAuthStatus, clearUser, fetchUser } from "@/redux/features/userSlice"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const NAV = [
  { href: "/member", label: "Overview", icon: UserCircle2, exact: true },
  { href: "/member/profile", label: "My Profile", icon: UserCircle2 },
  { href: "/member/id-card", label: "QR ID Card", icon: IdCard },
  { href: "/member/donations", label: "Donations", icon: IndianRupee },
  { href: "/member/certificates", label: "Certificates", icon: FileBadge },
  { href: "/member/appointment-letter", label: "Appointment", icon: FileText },
  { href: "/member/event-registration", label: "Events", icon: CalendarDays },
  { href: "/member/complaint", label: "Complaints", icon: MessageSquare },
]

import api from "@/service/api"

export default function MemberLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const status = useSelector(selectAuthStatus)
  const [isChecking, setIsChecking] = useState(true)
  const [memberInfo, setMemberInfo] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      router.replace("/login")
      return
    }
    if (token && !isAuthenticated && status !== "loading") {
      dispatch(fetchUser())
    }
  }, [dispatch, isAuthenticated, status, router])

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/members/me")
        .then(res => setMemberInfo(res.data?.member))
        .catch(() => {})
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (status === "succeeded" || status === "failed") {
      setIsChecking(false)
    }
    if (status === "failed") {
      router.replace("/login")
    }
  }, [status, router])

  if (isChecking || status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8]"><Loader2 className="size-8 animate-spin text-navy" /></div>
  }

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-serif text-lg font-bold text-white">Member Panel</p>
          <p className="text-[11px] uppercase tracking-wider text-white/50">Real Human Trust</p>
        </div>
        <nav className="space-y-0.5 p-3">
          {NAV.map((item) => { 
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href); 
            const Icon = item.icon; 
            
            let badge = null
            if (item.href === "/member/id-card" && memberInfo) {
              if (memberInfo.membershipStatus === "approved") {
                badge = <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">Active</span>
              } else if (memberInfo.membershipStatus === "pending") {
                badge = <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">Pending</span>
              }
            } else if (item.href === "/member/certificates" && memberInfo?.certificate?.length > 0) {
              badge = <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-400 text-[10px] font-extrabold text-slate-950 px-1.5">{memberInfo.certificate.length}</span>
            } else if (item.href === "/member/appointment-letter" && memberInfo?.appointmentLetter) {
              badge = <span className="ml-auto rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">Ready</span>
            }

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", active ? "bg-white/15 font-semibold text-white" : "text-white/65 hover:bg-white/10 hover:text-white")}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate flex-1">{item.label}</span>
                {badge}
              </Link>
            ) 
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-3">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/10 hover:text-white">
          <LayoutDashboard className="size-4" />Back to Website
        </Link>
        <button onClick={() => { setIsMobileMenuOpen(false); dispatch(clearUser()); router.push("/login") }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/55 hover:bg-white/10 hover:text-white">
          <LogOut className="size-4" />Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-dvh bg-[#f3f5f8]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 bg-navy text-white md:flex">
        {navContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 bg-white/90 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-white text-navy">
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-navy p-0 text-white border-none">
                <SheetTitle className="sr-only">Member menu</SheetTitle>
                {navContent}
              </SheetContent>
            </Sheet>
            <span className="font-serif font-bold text-navy">Member Dashboard</span>
          </div>

          <Link href="/member/profile" className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
            {user?.fullName?.[0] || "M"}
          </Link>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

