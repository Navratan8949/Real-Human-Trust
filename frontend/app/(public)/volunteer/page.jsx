"use client"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageHero } from "@/components/pages/page-hero"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { applyVolunteer } from "@/service/volunteer.service"

function VolunteerForm() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")
  const eventTitle = searchParams.get("eventTitle")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    message: eventTitle ? `I would like to volunteer for the event: ${eventTitle}` : ""
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await applyVolunteer(formData)
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-navy">Application Submitted!</h2>
        <p className="mt-2 text-emerald-700">Thank you for stepping up to help. We have received your volunteer application and will contact you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-navy">Full Name <span className="text-rose-500">*</span></label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-navy">Mobile Number <span className="text-rose-500">*</span></label>
          <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-navy">Email Address <span className="text-rose-500">*</span></label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-navy">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-navy">Why do you want to volunteer? (Message)</label>
          <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy" />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-navy text-base font-semibold text-white hover:bg-navy/90">
        {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Submit Application"}
      </Button>
    </form>
  )
}

export default function VolunteerPage() {
  return (
    <>
      <PageHero eyebrow="Get Involved" title="Become a Volunteer" description="Join our mission to bring a positive change in the society." image="/community-health-camp-india.png" />
      <div className="mx-auto max-w-3xl px-4 py-20">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-navy" /></div>}>
          <VolunteerForm />
        </Suspense>
      </div>
    </>
  )
}
