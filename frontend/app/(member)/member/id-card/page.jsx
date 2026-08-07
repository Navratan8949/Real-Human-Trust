"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { Loader2, Printer, ShieldAlert } from "lucide-react"
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

  if (!member) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-10 text-center shadow-soft">
        <ShieldAlert className="mx-auto size-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-serif text-xl font-bold">No ID Card Available</h2>
        <p className="mt-2 text-sm text-muted-foreground">You must apply for NGO membership to receive an ID card.</p>
      </div>
    )
  }

  if (member.membershipStatus !== "approved") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-10 text-center shadow-soft">
        <Loader2 className="mx-auto size-12 animate-spin text-amber-500" />
        <h2 className="mt-4 font-serif text-xl font-bold text-amber-900">Application Under Review</h2>
        <p className="mt-2 text-sm text-amber-700">Your membership application is currently {member.membershipStatus}. Your ID card will be generated once approved by the admin.</p>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const initials = user.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Digital ID Card</h1>
        <Button onClick={handlePrint} className="rounded-xl bg-navy text-white hover:bg-navy/90 print:hidden">
          <Printer className="size-4 mr-2" /> Print ID Card
        </Button>
      </div>

      {/* Style block for print specifically for the ID card */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #id-card, #id-card * { visibility: visible; }
          #id-card { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 3.375in; height: 2.125in; }
        }
      `}} />

      <div className="flex justify-center py-10">
        <div id="id-card" className="relative w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Header Banner */}
          <div className="bg-navy px-4 py-3 text-center">
            <h2 className="font-serif text-[15px] font-bold text-white leading-tight">REAL HUMAN EDUCATION<br/>& CHARITABLE TRUST</h2>
            <p className="text-[9px] uppercase tracking-wider text-white/80 mt-0.5">Govt. Regd. NGO</p>
          </div>
          
          <div className="p-4">
            <div className="flex gap-4">
              {/* Photo */}
              <div className="shrink-0 flex size-[70px] items-center justify-center overflow-hidden rounded bg-slate-100 border border-slate-200 text-lg font-bold text-slate-400">
                {member.profileImage?.url ? <img src={member.profileImage.url} alt="Profile" className="h-full w-full object-cover" /> : initials}
              </div>
              
              {/* Details */}
              <div className="space-y-1.5 flex-1">
                <div>
                  <p className="text-[9px] font-semibold uppercase text-muted-foreground">Name</p>
                  <p className="text-[13px] font-bold text-navy leading-none">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase text-muted-foreground">Member ID</p>
                  <p className="text-[13px] font-bold font-mono text-slate-700 leading-none">{member.memberId}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase text-muted-foreground">Blood</p>
                    <p className="text-[12px] font-bold text-rose-600 leading-none">{member.bloodGroup || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase text-muted-foreground">Type</p>
                    <p className="text-[12px] font-bold text-slate-700 leading-none capitalize">{member.membershipType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-dashed border-slate-200 pt-3">
              <div>
                <p className="text-[8px] font-medium text-slate-500">Contact: +91 8735899909</p>
                <p className="text-[8px] font-medium text-slate-500">Address: Rajkot, Gujarat</p>
              </div>
              {/* QR Code */}
              <div className="size-12 shrink-0 rounded bg-white">
                {member.qrCode && <img src={member.qrCode} alt="QR Code" className="h-full w-full" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
