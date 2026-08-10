"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { Loader2, Printer, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IdCard } from "@/components/shared/id-card"

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
      <div className="mx-auto max-w-md p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
          <ShieldAlert className="size-6" />
        </div>
        <h3 className="font-serif text-lg font-bold text-navy">No Membership Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">You have not applied for a membership yet or your application was not found.</p>
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

  const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "https://real-human-trust-nu.vercel.app")
  const verificationUrl = `${origin}/verify-member/${member.memberId}`

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Member ID Card</h1>
          <p className="text-xs text-muted-foreground">Official digital identification card for Real Human Trust.</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" size="sm" className="rounded-xl gap-2 font-semibold print:hidden">
          <Printer className="size-4" /> Print ID Card
        </Button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #id-card, #id-card * { visibility: visible; }
          #id-card { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
        }
      `}} />

      <div className="flex justify-center">
        <IdCard member={member} user={user} verificationUrl={verificationUrl} />
      </div>
    </div>
  )
}
