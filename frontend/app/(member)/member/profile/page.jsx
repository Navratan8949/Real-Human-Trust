"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/features/userSlice"
import api from "@/service/api"
import { CheckCircle2, Loader2, UserCircle2, Mail, Phone, MapPin, Briefcase, Droplet, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { setUser } from "@/redux/features/userSlice"
import { useDispatch } from "react-redux"

export default function Page() {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({})
  const [profileImage, setProfileImage] = useState(null)

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

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        address: user.address || "",
        district: user.district || "",
        state: user.state || "",
        bloodGroup: member?.bloodGroup || "",
        occupation: member?.occupation || "",
      })
    }
  }, [user, member, editOpen])

  if (loading || !user) return <div className="py-10 text-center"><Loader2 className="mx-auto size-6 animate-spin text-navy" /></div>

  const initials = user.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "U"

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([k, v]) => form.append(k, v))
      if (profileImage) form.append("profileImage", profileImage)

      const res = await api.put("/members/me", form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      const updatedMember = res.data.member
      setMember(updatedMember)
      dispatch(setUser(updatedMember.user))
      
      toast.success("Profile updated successfully")
      setEditOpen(false)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-bold text-navy">My Profile</h1>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button variant="outline" className="rounded-xl border-navy/20 font-semibold text-navy hover:bg-navy/5" />}>
            Edit Profile
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Edit Profile Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <Input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required /></div>
                <div className="space-y-2"><Label>Mobile</Label><Input value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} /></div>
                {member && (
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(v) => setFormData({...formData, bloodGroup: v})}>
                      <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="space-y-2"><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>District</Label><Input value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} /></div>
                <div className="space-y-2"><Label>State</Label><Input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} /></div>
              </div>
              {member && (
                <div className="space-y-2"><Label>Occupation</Label><Input value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} /></div>
              )}
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-navy text-white hover:bg-navy/90" disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 size-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-3xl font-bold text-white shadow-md">
            {member?.profileImage?.url ? <img src={member.profileImage.url} alt="Profile" className="h-full w-full object-cover" /> : initials}
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-navy">{user.fullName}</h2>
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
