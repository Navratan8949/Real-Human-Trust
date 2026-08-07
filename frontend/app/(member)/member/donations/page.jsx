"use client"
import { useEffect, useState } from "react"
import { Loader2, Receipt } from "lucide-react"
import api from "@/service/api"

export default function Page() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDonations() {
      try {
        const res = await api.get("/donations/me")
        setDonations(res.data?.donations || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft md:p-8">
      <h1 className="font-serif text-2xl font-bold">Donation history</h1>
      <p className="mt-2 text-sm text-muted-foreground">Track all your contributions and download 80G tax receipts.</p>
      
      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="py-10 text-center"><Loader2 className="mx-auto size-6 animate-spin text-navy" /></div>
        ) : donations.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No donations found.</div>
        ) : (
          donations.map((donation) => (
            <div key={donation._id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-secondary/30 border border-border/40 px-4 py-4 text-sm gap-4">
              <div>
                <span className="font-bold text-navy block text-lg">₹{donation.amount}</span>
                <span className="text-muted-foreground text-xs mt-1 block">
                  {new Date(donation.createdAt).toLocaleDateString()} • {donation.paymentMethod || "Online"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${donation.paymentStatus === 'completed' || donation.paymentStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {donation.paymentStatus}
                </span>
                {(donation.paymentStatus === 'completed' || donation.paymentStatus === 'verified') && (
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:underline">
                    <Receipt className="size-3.5" /> Receipt
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
