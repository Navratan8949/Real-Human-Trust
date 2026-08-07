"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, LogOut, ExternalLink } from "lucide-react"
import { AdminNavLinks, AdminSidebar } from "@/components/admin/sidebar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminAuthGuard } from "@/components/admin/auth-guard"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, clearUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD"

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout")
      dispatch(clearUser())
      toast.success("Logged out successfully")
      router.push("/admin-login")
    } catch (err) {
      toast.error("Error logging out")
    }
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-dvh bg-[#f3f5f8]">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-white/90 px-4 backdrop-blur-md md:h-16 md:px-6">
            <div className="flex items-center gap-2 lg:hidden">
              <Sheet>
                <SheetTrigger className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-white"><Menu className="size-4" /></SheetTrigger>
                <SheetContent side="left" className="w-72 bg-navy p-0 text-white">
                  <SheetTitle className="sr-only">Admin menu</SheetTitle>
                  <div className="p-4"><p className="font-serif text-lg font-bold">Admin</p>
                    <div className="mt-4 grid gap-1 text-sm"><AdminNavLinks user={user} /></div>
                  </div>
                </SheetContent>
              </Sheet>
              <span className="font-serif font-bold text-navy">Admin</span>
            </div>
            <div className="relative hidden flex-1 items-center gap-4 sm:flex px-4 text-sm font-medium text-muted-foreground">
              <span className="hidden lg:inline-block">
                {greeting}, <strong className="text-navy text-lg">{user?.fullName?.split(" ")[0] || "Admin"}</strong>
              </span>

              {/* <Link 
                href="/" 
                target="_blank" 
                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-secondary"
              >
                View Live Website <ExternalLink className="size-3.5" />
              </Link> */}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/profile" className="flex size-9 overflow-hidden items-center justify-center rounded-xl bg-navy text-xs font-bold text-white transition hover:ring-2 hover:ring-accent hover:ring-offset-2">
                {user?.profileImage?.url ? (
                  <img src={user.profileImage.url} alt="Profile" className="size-full object-cover" />
                ) : (
                  initials
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
