"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { CheckCircle2, ShieldAlert, UploadCloud, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MembershipPage() {
  const user = useSelector(selectUser)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    bloodGroup: "",
    occupation: "",
    membershipType: "general",
    referredBy: "",
    profileImage: null,
    idProof: null
  })

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const data = new FormData()
      data.append("bloodGroup", formData.bloodGroup)
      data.append("occupation", formData.occupation)
      data.append("membershipType", formData.membershipType)
      data.append("referredBy", formData.referredBy)
      if (formData.profileImage) data.append("profileImage", formData.profileImage)
      if (formData.idProof) data.append("idProof", formData.idProof)

      await api.post("/members/apply", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/member")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-navy/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy mb-4">Official NGO Membership</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">Join the Movement.</h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Become an official member of Real Human Trust to actively participate in campaigns, vote in meetings, and make a real difference.
          </p>
        </div>

        {!user ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-10 text-center shadow-lg">
            <ShieldAlert className="mx-auto size-12 text-amber-500 mb-4" />
            <h2 className="font-serif text-2xl font-bold text-amber-900">Login Required</h2>
            <p className="mt-2 text-amber-700 max-w-md mx-auto mb-6">
              You must create a free web account and log in before you can apply for an official NGO membership.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="rounded-xl bg-navy text-white hover:bg-navy/90 h-12 px-8">
                <a href="/login">Login to Account</a>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-12 px-8">
                <a href="/signup">Create Web Account</a>
              </Button>
            </div>
          </div>
        ) : success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-12 text-center shadow-lg">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
              <CheckCircle2 className="size-10 text-emerald-600" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-emerald-900">Application Submitted!</h2>
            <p className="mt-4 text-lg text-emerald-700 max-w-lg mx-auto">
              Your official membership application has been received and is under review. You will be redirected to your dashboard shortly.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-white p-6 sm:p-10 shadow-xl">
            <div className="mb-8 border-b border-border/50 pb-6">
              <h2 className="font-serif text-2xl font-bold text-navy flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-navy/10 text-navy font-sans text-sm">1</div>
                Application Form
              </h2>
            </div>
            
            {error && (
              <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Blood Group *</label>
                  <select required value={formData.bloodGroup} onChange={e => setFormData(f => ({ ...f, bloodGroup: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy">
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Occupation *</label>
                  <input required type="text" value={formData.occupation} onChange={e => setFormData(f => ({ ...f, occupation: e.target.value }))} placeholder="e.g. Software Engineer, Student" className="mt-1.5 w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Membership Type *</label>
                  <select required value={formData.membershipType} onChange={e => setFormData(f => ({ ...f, membershipType: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy">
                    <option value="general">General Member</option>
                    <option value="student">Student Member</option>
                    <option value="lifetime">Lifetime Member</option>
                    <option value="honorary">Honorary Member</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Referred By (Optional)</label>
                  <input type="text" value={formData.referredBy} onChange={e => setFormData(f => ({ ...f, referredBy: e.target.value }))} placeholder="Member ID or Name" className="mt-1.5 w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy" />
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <h3 className="font-serif text-lg font-bold text-navy mb-4">Identity Verification</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer">
                    <input required type="file" accept="image/*" onChange={e => handleFileChange(e, 'profileImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="mx-auto size-8 text-navy/60 mb-3" />
                    <p className="text-sm font-semibold text-navy">Profile Photo *</p>
                    <p className="text-xs text-muted-foreground mt-1">{formData.profileImage ? formData.profileImage.name : "For your digital ID card"}</p>
                  </div>
                  
                  <div className="relative rounded-2xl border-2 border-dashed border-border/60 bg-slate-50 hover:bg-slate-100 transition-colors p-6 text-center cursor-pointer">
                    <input required type="file" accept="image/*,.pdf" onChange={e => handleFileChange(e, 'idProof')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud className="mx-auto size-8 text-navy/60 mb-3" />
                    <p className="text-sm font-semibold text-navy">ID Proof (Aadhar/PAN) *</p>
                    <p className="text-xs text-muted-foreground mt-1">{formData.idProof ? formData.idProof.name : "Govt. issued ID card"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 shadow-md">
                  {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Submit Application"}
                  {!loading && <ArrowRight className="ml-2 size-5" />}
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By submitting this application, you agree to abide by the rules and regulations of Real Human Trust.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
