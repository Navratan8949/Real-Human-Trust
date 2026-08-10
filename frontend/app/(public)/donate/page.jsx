"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Heart, Building2, Smartphone, Copy, Check,
  ArrowRight, ShieldCheck, BadgeCheck, Banknote,
  QrCode, ChevronRight, Users, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { getProjectById } from "@/service/project.service"
import { getCrowdfundingById } from "@/service/crowdfunding.service"
import { QRCodeSVG } from "qrcode.react"
import Script from "next/script"
import { FaqSection } from "@/components/sections/faq-section"

// Dynamic Bank Details are now fetched from Redux state

const QUICK_AMOUNTS = [500, 1000, 2100, 5000, 11000, 21000]

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied!")
  }
  return (
    <button
      onClick={copy}
      className="ml-2 inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground transition hover:bg-accent/10 hover:text-accent"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

function ManualDonationFormInner() {
  const [loading, setLoading] = useState(false)
  const [linkedTitle, setLinkedTitle] = useState("")
  const [linkedType, setLinkedType] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get("projectId")
  const campaignId = searchParams.get("campaignId")

  const [amount, setAmount] = useState("")
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    paymentMethod: "upi", transactionId: "", purpose: ""
  })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId).then(res => {
        if (res?.success) {
          const title = res.project?.title || res.data?.title
          if (title) {
            setLinkedTitle(title)
            setLinkedType("Project")
            setForm(f => ({ ...f, purpose: `Donation for project: ${title}` }))
          }
        }
      }).catch(err => console.error(err))
    } else if (campaignId) {
      getCrowdfundingById(campaignId).then(res => {
        if (res?.success) {
          const title = res.campaign?.title || res.data?.title
          if (title) {
            setLinkedTitle(title)
            setLinkedType("Campaign")
            setForm(f => ({ ...f, purpose: `Donation for campaign: ${title}` }))
          }
        }
      }).catch(err => console.error(err))
    }
  }, [projectId, campaignId])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleRazorpayPayment() {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://locahost:8000/api/v1"
      const res = await fetch(`${apiBase}/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount, projectId, campaignId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Order creation failed")

      const { order, donationId } = data

      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK failed to load. Please refresh the page.")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Real Human Education & Charitable Trust",
        description: form.purpose || "Donation",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${apiBase}/donations/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId
              })
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed")
            toast.success("Payment successful! 80G Receipt sent to your email.")
            router.push(`/donation-success?id=${donationId}`)
            setForm({ fullName: "", email: "", phone: "", paymentMethod: "online", transactionId: "", purpose: "" })
            setAmount("")
          } catch (err) {
            toast.error(err.message || "Payment verification failed")
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: "#16307a"
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.message || "Razorpay initiation failed")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.paymentMethod === "online") {
      return handleRazorpayPayment()
    }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries({ ...form, amount }).forEach(([k, v]) => fd.append(k, v))
      if (projectId) fd.append("projectId", projectId)
      if (campaignId) fd.append("campaignId", campaignId)
      if (file) fd.append("paymentProof", file)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/donations/manual`, {
        method: "POST", body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("Donation submitted! We'll verify within 24 hours.")
      router.push(`/donation-success?id=${data.donation._id}`)
      setForm({ fullName: "", email: "", phone: "", paymentMethod: "upi", transactionId: "", purpose: "" })
      setAmount(""); setFile(null)
    } catch (err) {
      toast.error(err.message || "Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={onSubmit} className="grid gap-4">
        {linkedTitle && (
          <div className="mb-2 flex items-start gap-3 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-[#050a30]">
            <Info className="mt-0.5 size-5 shrink-0 text-[#138808]" />
            <div>
              <p className="font-medium text-[#138808]">Linked {linkedType}</p>
              <p className="font-semibold text-foreground">You are donating specifically to: {linkedTitle}</p>
            </div>
          </div>
        )}

        {/* Quick amount selector */}
        <div className="rounded-2xl border border-border/40 bg-secondary/20 p-5">
          <Label className="mb-3 block text-sm font-bold text-navy">Select Amount (₹) *</Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {QUICK_AMOUNTS.map(a => (
              <button key={a} type="button"
                onClick={() => setAmount(String(a))}
                className={`rounded-xl py-3 text-sm font-bold transition-all duration-200 ${amount === String(a)
                  ? "bg-navy text-white shadow-md scale-[1.02]"
                  : "bg-white border border-border/60 text-muted-foreground hover:border-navy/30 hover:text-navy"}`}
              >
                ₹{a >= 1000 ? (a / 1000) + "K" : a}
              </button>
            ))}
          </div>
          <div className="relative mt-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
            <Input
              className="h-12 rounded-xl pl-8 border-border/60 bg-white font-semibold shadow-sm focus-visible:ring-navy"
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min={1}
            />
          </div>
        </div>

        {/* Personal info */}
        <div className="grid gap-5 sm:grid-cols-2 mt-2">
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
            <Input className="h-12 rounded-xl border-border/60 shadow-sm focus-visible:ring-navy font-medium" value={form.fullName} onChange={e => set("fullName", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address *</Label>
            <Input type="email" className="h-12 rounded-xl border-border/60 shadow-sm focus-visible:ring-navy font-medium" value={form.email} onChange={e => set("email", e.target.value)} required />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
            <Input className="h-12 rounded-xl border-border/60 shadow-sm focus-visible:ring-navy font-medium" value={form.phone} onChange={e => set("phone", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Method *</Label>
            <div className="relative">
              <select
                className="h-12 w-full appearance-none rounded-xl border border-border/60 bg-white px-4 text-sm font-semibold text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-navy"
                value={form.paymentMethod}
                onChange={e => set("paymentMethod", e.target.value)}
              >
                <option value="online">Instant Online (Card/UPI)</option>
                <option value="upi">Direct UPI (QR / VPA)</option>
                <option value="bank">Bank Transfer (NEFT)</option>
                <option value="cash">Cash Contribution</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-4 rotate-90 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {form.paymentMethod !== "online" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-amber-900">Transaction ID / Reference (UTR) *</Label>
              <Input
                className="h-12 rounded-xl border-amber-200 bg-white font-medium"
                placeholder="Enter 12-digit UPI Ref / UTR Number"
                value={form.transactionId}
                onChange={e => set("transactionId", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-amber-900">Payment Screenshot (Optional)</Label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="block w-full cursor-pointer rounded-xl border border-dashed border-amber-300 bg-white/50 px-4 py-3 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-amber-100 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-amber-800 transition hover:bg-white"
              />
            </div>
          </div>
        )}

        <div className="grid gap-2 mt-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Donation Purpose (Optional)</Label>
          <Textarea
            className="min-h-24 rounded-xl border-border/60 shadow-sm focus-visible:ring-navy font-medium resize-none"
            placeholder="E.g. Education fund, General donation, or in memory of someone..."
            value={form.purpose}
            onChange={e => set("purpose", e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-4 h-14 w-full rounded-xl bg-accent text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent/90"
        >
          {loading ? "Processing Securely…" : form.paymentMethod === "online" ? (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck className="size-5" /> Pay Securely (₹{amount || "0"})
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Check className="size-5" /> Submit Donation Details
            </span>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {form.paymentMethod === "online"
            ? "Instant 80G tax receipt will be sent directly to your email."
            : "Our team will verify your offline donation within 24 hours and email your receipt."}
        </p>
      </form>
    </>
  )
}

function ManualDonationForm() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-secondary/50"></div>}>
      <ManualDonationFormInner />
    </Suspense>
  )
}

import { useDispatch, useSelector } from "react-redux"
import { fetchSiteContent } from "@/redux/features/siteContentSlice"

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState("upi")
  const dispatch = useDispatch()
  const { data: siteContent } = useSelector((state) => state.siteContent)

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  // Parse donate details from Redux or fallback to default
  let BANK = {
    accountName: "Real Human Education & Charitable Trust",
    accountNumber: "1234567890123456",
    ifsc: "SBIN0001234",
    bank: "State Bank of India",
    branch: "Rajkot Main Branch",
    upi: "realhumantrust@sbi",
    qrImage: ""
  }

  if (siteContent?.donate_details?.content) {
    try {
      const parsed = JSON.parse(siteContent.donate_details.content)
      BANK = { ...BANK, ...parsed, upi: parsed.upiId, ifsc: parsed.ifscCode }
    } catch(e) {}
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy py-24 text-white sm:py-32">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/children-receiving-school-supplies-india.png"
            alt="Donate background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        </div>

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,153,51,0.15),transparent)]"></div>

        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8 relative z-10">
          <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md">
            <Heart className="size-4 text-[#ff9933] fill-[#ff9933] animate-pulse" /> Your Support Matters
          </div>
          <h1 className="mt-8 font-serif text-5xl font-bold tracking-tight text-white sm:text-7xl drop-shadow-xl">
            Give the gift of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 drop-shadow-md">hope</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90 drop-shadow-lg">
            Every contribution, no matter the size, directly empowers rural education, healthcare, and community welfare programs across Gujarat.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-white/80">
            {["80G Tax Exemption", "100% Transparent", "Secure Payments"].map((b, i) => (
              <span key={b} className="flex items-center gap-2">
                <BadgeCheck className={`size-5 ${i === 0 ? "text-[#138808]" : "text-[#ff9933]"}`} /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Impact quick stats (Floating) */}
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-white p-4 shadow-xl shadow-navy/5 md:grid-cols-4 md:gap-8 md:p-8 border border-border/50">
          {[
            ["₹500", "Feeds 10 children for a week", "bg-rose-50 text-rose-600"],
            ["₹1,000", "Buys school supplies for 5 kids", "bg-amber-50 text-amber-600"],
            ["₹5,000", "Funds a local health camp", "bg-emerald-50 text-emerald-600"],
            ["₹21,000", "Sponsors one child's education", "bg-blue-50 text-blue-600"],
          ].map(([amt, label, color]) => (
            <div key={amt} className="flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-transform hover:-translate-y-1">
              <div className={`mb-3 inline-flex rounded-full px-4 py-1.5 font-bold ${color}`}>
                {amt}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

        {/* LEFT — Payment Details */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#050a30]">How to donate</h2>

          <div className="flex rounded-xl border border-border bg-secondary/30 p-1 shadow-inner">
            {[["upi", <Smartphone key="upi" className="size-4" />, "UPI / QR Code"], ["bank", <Building2 key="bank" className="size-4" />, "Bank Transfer"]].map(([key, icon, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${activeTab === key
                  ? "bg-white shadow-md text-navy ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {activeTab === "upi" && (
            <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-white to-secondary/20 p-8 shadow-sm">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="flex size-40 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-white shadow-md text-center ring-4 ring-secondary/50 p-3">
                  {BANK.qrImage ? (
                    <img src={BANK.qrImage} alt="UPI QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <QRCodeSVG
                      value={`upi://pay?pa=${BANK.upi}&pn=${encodeURIComponent(BANK.accountName)}&cu=INR`}
                      size={110}
                      level="Q"
                    />
                  )}
                  <p className="mt-2 text-[10px] font-bold text-muted-foreground">Scan via any UPI App</p>
                </div>
                <div className="flex-1 space-y-5 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">UPI ID</p>
                    <p className="mt-1 flex items-center font-mono text-lg font-bold text-navy">
                      {BANK.upi}
                      <CopyBtn text={BANK.upi} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Name</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{BANK.accountName}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900 shadow-sm">
                    After payment, fill the form with your Transaction ID to get a receipt.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-white to-secondary/20 p-8 shadow-sm">
              <div className="space-y-4 text-sm">
                {[
                  ["Account Name", BANK.accountName],
                  ["Account Number", BANK.accountNumber],
                  ["IFSC Code", BANK.ifsc],
                  ["Bank", BANK.bank],
                  ["Branch", BANK.branch],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <span className="font-medium text-muted-foreground">{label}</span>
                    <span className="flex items-center font-bold text-navy">
                      {value}
                      <CopyBtn text={value} />
                    </span>
                  </div>
                ))}
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-900 shadow-sm">
                  Use NEFT / RTGS / IMPS. After transfer, fill the form with your UTR number.
                </div>
              </div>
            </div>
          )}

          {/* Transparency section */}
          <div className="rounded-3xl bg-navy p-8 text-white shadow-xl">
            <h3 className="font-serif text-2xl font-bold">Where your money goes</h3>
            <p className="mt-2 text-sm text-white/70">A breakdown of our financial allocation to ensure maximum impact.</p>
            <div className="mt-8 space-y-5">
              {[
                ["Education Programs", 45, "#ff9933"],
                ["Healthcare & Nutrition", 30, "#138808"],
                ["Community Empowerment", 15, "#4a90d9"],
                ["Administration", 10, "#94a3b8"],
              ].map(([label, pct, color]) => (
                <div key={label} className="group">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">{label}</span>
                    <span className="font-bold text-white">{pct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/reports/annual" className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-amber-400 transition-colors">
              View Annual Reports <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Tax benefit */}
          <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <p className="font-bold text-emerald-900">80G Tax Exemption Eligible</p>
              <p className="mt-1.5 text-sm leading-relaxed text-emerald-800/80">
                Donations are eligible for 80G tax deduction. You'll automatically receive an official receipt by email for IT filing upon verification.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Manual Donation Form */}
        <div className="relative">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-border/40 bg-white shadow-2xl shadow-navy/5">
            <div className="bg-gradient-to-r from-navy to-[#0a1142] px-8 py-6 text-white">
              <h2 className="font-serif text-2xl font-bold">Secure Donation</h2>
              <p className="mt-1 text-sm font-medium text-white/70">Your contribution is 100% tax exempted under 80G.</p>
            </div>
            <div className="p-6 md:p-8">
              <ManualDonationForm />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Band */}
      {/* <section className="bg-[#ff9933] py-14 text-center text-white">
        <Users className="mx-auto mb-4 size-10 opacity-80" />
        <h2 className="font-serif text-3xl font-bold">Want to do more?</h2>
        <p className="mt-3 text-white/85">Become a member or volunteer to directly impact lives on the ground.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full bg-white px-6 font-bold text-[#050a30] hover:bg-white/90">
            <Link href="/membership">Become a Member <ArrowRight className="ml-2 size-4" /></Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full border-white/30 px-6 font-bold text-white hover:bg-white/15">
            <Link href="/volunteer">Volunteer with us</Link>
          </Button>
        </div>
      </section> */}

      <FaqSection />
    </>
  )
}
