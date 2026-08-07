"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { CheckCircle2, Loader2, UserCircle2, Mail, Phone, MapPin, Briefcase, Droplet, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  const user = useSelector(selectUser)
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/members/me")
        setMember(res.data?.member)
      } catch (err) {
        // Normal if 404
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading || !user) return <div className="py-10 text-center"><Loader2 className="mx-auto size-6 animate-spin text-navy" /></div>

  const initials = user.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-3xl font-bold text-white shadow-md">
            {member?.profileImage?.url ? <img src={member.profileImage.url} alt="Profile" className="h-full w-full object-cover" /> : initials}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold text-navy">{user.fullName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            {member ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold font-mono text-navy">
                  ID: {member.memberId}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  member.membershipStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                  member.membershipStatus === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {member.membershipStatus === 'approved' && <CheckCircle2 className="size-3.5" />}
                  {member.membershipStatus} Member
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                  {member.membershipType}
                </span>
                {member.membershipStatus === 'rejected' && (
                  <div className="w-full mt-2 rounded-xl bg-rose-50 border border-rose-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">Reason for Rejection</p>
                    <p className="text-sm text-rose-700 mb-3">{member.rejectionReason}</p>
                    <Button asChild size="sm" className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"><Link href="/membership">Apply Again</Link></Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Public Web Account</span>
                <p className="mt-2 text-xs text-muted-foreground">You have not applied for official NGO membership yet.</p>
                <Button asChild size="sm" className="mt-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"><Link href="/membership">Apply Now</Link></Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Details */}
        <div className="rounded-2xl border border-border/60 bg-white shadow-soft overflow-hidden">
          <div className="border-b border-border/50 bg-secondary/30 px-6 py-4">
            <h2 className="font-serif text-lg font-bold flex items-center gap-2"><UserCircle2 className="size-5 text-navy" /> Account Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-[24px_1fr] items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5" />
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p><p className="font-medium">{user.email}</p></div>
            </div>
            <div className="grid grid-cols-[24px_1fr] items-start gap-3">
              <Phone className="size-5 text-muted-foreground mt-0.5" />
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mobile</p><p className="font-medium">{user.mobile}</p></div>
            </div>
            {user.dob && (
              <div className="grid grid-cols-[24px_1fr] items-start gap-3">
                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date of Birth</p><p className="font-medium">{new Date(user.dob).toLocaleDateString()}</p></div>
              </div>
            )}
            <div className="grid grid-cols-[24px_1fr] items-start gap-3">
              <MapPin className="size-5 text-muted-foreground mt-0.5" />
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</p>
              <p className="font-medium">{user.address ? `${user.address}, ` : ''}{user.district}, {user.state}</p></div>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        {member && (
          <div className="rounded-2xl border border-border/60 bg-white shadow-soft overflow-hidden">
            <div className="border-b border-border/50 bg-secondary/30 px-6 py-4">
              <h2 className="font-serif text-lg font-bold flex items-center gap-2"><FileText className="size-5 text-navy" /> NGO Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-[24px_1fr] items-start gap-3">
                <Droplet className="size-5 text-rose-500 mt-0.5" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blood Group</p><p className="font-medium">{member.bloodGroup || "Not Provided"}</p></div>
              </div>
              <div className="grid grid-cols-[24px_1fr] items-start gap-3">
                <Briefcase className="size-5 text-muted-foreground mt-0.5" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Occupation</p><p className="font-medium">{member.occupation || "Not Provided"}</p></div>
              </div>
              <div className="grid grid-cols-[24px_1fr] items-start gap-3">
                <Calendar className="size-5 text-muted-foreground mt-0.5" />
                <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joining Date</p><p className="font-medium">{new Date(member.joiningDate).toLocaleDateString()}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
