"use client"
import Link from "next/link"
import { CalendarDays, CheckCircle2, FileBadge, IndianRupee, Loader2, IdCard, MessageSquarePlus, Heart, ArrowRight, ShieldCheck, Clock, FileText, BellRing, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import { useEffect, useState } from "react"
import api from "@/service/api"

export default function Page() {
  const user = useSelector(selectUser)
  const [member, setMember] = useState(null)
  const [stats, setStats] = useState({ donations: 0, events: 0, certificates: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        // Fetch Member Status
        try {
          const memberRes = await api.get("/members/me");
          setMember(memberRes.data?.member)
        } catch (e) {}
        
        // Fetch Donations Count
        try {
          const donationRes = await api.get("/donations/me");
          setStats(s => ({ ...s, donations: donationRes.data?.donations?.length || 0 }))
        } catch (e) {}

        // Fetch Events Count
        try {
          const eventRes = await api.get("/event-registration/me");
          setStats(s => ({ ...s, events: eventRes.data?.data?.length || eventRes.data?.registrations?.length || 0 }))
        } catch (e) {}

        // Fetch Certificates Count
        try {
          const certRes = await api.get("/certificates/me");
          setStats(s => ({ ...s, certificates: certRes.data?.certificates?.length || 0 }))
        } catch (e) {}

        // Fetch Appointments Count
        try {
          const appRes = await api.get("/appointments/me");
          setStats(s => ({ ...s, appointments: appRes.data?.count || 0 }))
        } catch (e) {}

      } finally {
        setLoading(false)
      }
    }
    
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user])

  if (!user) return <div className="py-12 text-center"><Loader2 className="mx-auto size-7 animate-spin text-navy" /></div>

  const initials = user.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U"
  const isApproved = member?.membershipStatus === 'approved'
  const isPending = member?.membershipStatus === 'pending'
  const isRejected = member?.membershipStatus === 'rejected'

  return (
    <div className="space-y-6 pb-10">
      {/* Welcome Banner & Quick Action Hub */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy md:text-3xl">
            Welcome back, {user.fullName?.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your NGO membership, donations, registered events, and official documents.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/member/id-card"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-navy/90"
          >
            <IdCard className="size-3.5" />
            My ID Card
          </Link>

          <Link
            href="/donate"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            <Heart className="size-3.5 fill-white" />
            Donate
          </Link>

          <Link
            href="/member/event-registration"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50"
          >
            <CalendarDays className="size-3.5 text-accent" />
            Events
          </Link>

          <Link
            href="/member/complaint"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50"
          >
            <MessageSquarePlus className="size-3.5 text-rose-600" />
            Raise Issue
          </Link>
        </div>
      </div>

      {/* Membership Pipeline Tracker (If applied or not) */}
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-base font-semibold text-navy flex items-center gap-2">
              <UserCheck className="size-4 text-navy" /> Membership Status Tracker
            </h2>
            <p className="text-xs text-muted-foreground">Live application progress</p>
          </div>
          {!member && (
            <Button asChild size="sm" className="rounded-lg bg-navy text-white hover:bg-navy/90 text-xs font-semibold">
              <Link href="/membership">Apply for Membership →</Link>
            </Button>
          )}
        </div>

        {/* 3 Step Status Pipeline */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Step 1 */}
          <div className={`rounded-xl border p-4 transition-all ${member ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className={`size-4 ${member ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">Step 1: Application</span>
            </div>
            <p className="text-sm font-semibold">{member ? "Submitted Successfully" : "Not Applied Yet"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{member ? `Type: ${member.membershipType}` : "Join Real Human Trust"}</p>
          </div>

          {/* Step 2 */}
          <div className={`rounded-xl border p-4 transition-all ${isApproved ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' : isPending ? 'border-amber-200 bg-amber-50/60 text-amber-900' : isRejected ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center gap-2 mb-1">
              {isApproved ? <ShieldCheck className="size-4 text-emerald-600" /> : isPending ? <Clock className="size-4 text-amber-600" /> : <Clock className="size-4 text-slate-400" />}
              <span className="text-xs font-bold uppercase tracking-wider">Step 2: Verification</span>
            </div>
            <p className="text-sm font-semibold">
              {isApproved ? "Approved by Admin" : isPending ? "Under Admin Review" : isRejected ? "Application Rejected" : "Pending Application"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isApproved ? "Official member" : isPending ? "Reviews take 24-48h" : isRejected ? member.rejectionReason || "Check profile" : "Requires application"}
            </p>
          </div>

          {/* Step 3 */}
          <div className={`rounded-xl border p-4 transition-all ${isApproved ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center gap-2 mb-1">
              <IdCard className={`size-4 ${isApproved ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold uppercase tracking-wider">Step 3: Official ID</span>
            </div>
            <p className="text-sm font-semibold">{isApproved ? "QR Card Active" : "Locked"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{isApproved ? `ID: ${member.memberId}` : "Unlocks after approval"}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile & Metric Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Profile Card & Notice */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Member Profile Box */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-navy text-lg font-bold text-white shrink-0">
                {member?.profileImage?.url ? <img src={member.profileImage.url} alt="Profile" className="h-full w-full object-cover" /> : initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-bold text-navy truncate">{user.fullName}</h3>
                {member ? (
                  <>
                    <p className="text-xs font-mono font-semibold text-slate-500">{member.memberId}</p>
                    <span className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {isApproved && <CheckCircle2 className="size-3" />}
                      <span className="capitalize">{member.membershipStatus} Member</span>
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">Public Account</p>
                )}
              </div>
            </div>

            <div className="mt-5 border-t border-border/50 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Email:</span>
                <span className="font-medium text-navy truncate max-w-[170px]">{user.email}</span>
              </div>
              {member?.bloodGroup && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Blood Group:</span>
                  <span className="font-bold text-rose-600">{member.bloodGroup}</span>
                </div>
              )}
              {member?.occupation && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Occupation:</span>
                  <span className="font-medium text-navy">{member.occupation}</span>
                </div>
              )}
            </div>

            <Button asChild variant="outline" className="mt-5 h-9 w-full rounded-xl text-xs font-semibold border-border">
              <Link href="/member/profile">View & Edit Profile</Link>
            </Button>
          </div>

          {/* Announcement Box */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm">
            <h3 className="font-serif text-sm font-semibold text-blue-950 flex items-center gap-2 mb-2">
              <BellRing className="size-4 text-blue-600" /> Community Notice
            </h3>
            <p className="text-xs text-blue-900/80 leading-relaxed">
              Keep your profile and ID proof updated to download your official verified Member QR Card for upcoming NGO events.
            </p>
          </div>

        </div>

        {/* Metric Cards Grid (2 Columns) */}
        <div className="space-y-6 lg:col-span-2">
          
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Donations Card */}
            <Link href="/member/donations" className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Donations</span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <IndianRupee className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : (
                  <p className="font-serif text-3xl font-bold text-navy">{stats.donations}</p>
                )}
                <p className="mt-1 flex items-center text-xs font-semibold text-emerald-700 hover:underline">
                  View donation history <ArrowRight className="ml-1 size-3" />
                </p>
              </div>
            </Link>

            {/* Events Card */}
            <Link href="/member/event-registration" className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Events</span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CalendarDays className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : (
                  <p className="font-serif text-3xl font-bold text-navy">{stats.events}</p>
                )}
                <p className="mt-1 flex items-center text-xs font-semibold text-blue-700 hover:underline">
                  Browse NGO camps <ArrowRight className="ml-1 size-3" />
                </p>
              </div>
            </Link>

            {/* Certificates Card */}
            <Link href="/member/certificates" className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Certificates</span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <FileBadge className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : (
                  <p className="font-serif text-3xl font-bold text-navy">{stats.certificates}</p>
                )}
                <p className="mt-1 flex items-center text-xs font-semibold text-violet-700 hover:underline">
                  View issued certificates <ArrowRight className="ml-1 size-3" />
                </p>
              </div>
            </Link>

            {/* Appointment Letters Card */}
            <Link href="/member/appointment-letter" className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appointments</span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <FileText className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                {loading ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : (
                  <p className="font-serif text-3xl font-bold text-navy">{stats.appointments}</p>
                )}
                <p className="mt-1 flex items-center text-xs font-semibold text-amber-700 hover:underline">
                  Download appointment letters <ArrowRight className="ml-1 size-3" />
                </p>
              </div>
            </Link>

          </div>

        </div>

      </div>
    </div>
  )
}
