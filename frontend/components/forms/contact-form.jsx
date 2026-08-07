"use client"

import { useState } from "react"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { createContact } from "@/service/contact.service"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log('formData Contact', formData)
      await createContact(formData)
      setSuccess(true)
      // setFormData({ name: "", email: "", mobile: "", subject: "", message: "" })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {success && (
        <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 flex items-center gap-3 border border-emerald-100">
          <CheckCircle2 className="size-5" />
          <span className="font-semibold text-sm">Thank you! Your message has been sent successfully. We will get back to you soon.</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-rose-700 font-semibold text-sm border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Name Input */}
        <div className="relative group">
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            disabled={loading}
            className="peer w-full border-0 border-b-2 border-border/60 bg-transparent py-3 text-base text-foreground transition-colors focus:border-navy focus:outline-none focus:ring-0 disabled:opacity-50"
            required
          />
        </div>

        {/* Email Input */}
        <div className="relative group">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            disabled={loading}
            className="peer w-full border-0 border-b-2 border-border/60 bg-transparent py-3 text-base text-foreground transition-colors focus:border-navy focus:outline-none focus:ring-0 disabled:opacity-50"
            required
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Phone Input */}
        <div className="relative group">
          <input
            type="tel"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Phone Number"
            disabled={loading}
            className="peer w-full border-0 border-b-2 border-border/60 bg-transparent py-3 text-base text-foreground transition-colors focus:border-navy focus:outline-none focus:ring-0 disabled:opacity-50"
          />
        </div>

        {/* Subject Input */}
        <div className="relative group">
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            disabled={loading}
            className="peer w-full border-0 border-b-2 border-border/60 bg-transparent py-3 text-base text-foreground transition-colors focus:border-navy focus:outline-none focus:ring-0 disabled:opacity-50"
            required
          />
        </div>
      </div>

      {/* Message Input */}
      <div className="relative group pt-4">
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          rows={4}
          disabled={loading}
          className="peer w-full resize-none border-0 border-b-2 border-border/60 bg-transparent py-3 text-base text-foreground transition-colors focus:border-navy focus:outline-none focus:ring-0 disabled:opacity-50"
          required
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-navy px-10 text-base font-bold text-white transition-all hover:bg-navy/90 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Send Message"}
          {!loading && <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  )
}
