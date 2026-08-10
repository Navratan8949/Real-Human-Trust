"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSiteContent } from "@/redux/features/siteContentSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/service/api"
import { Loader2, Plus, Trash2, Save } from "lucide-react"
import Image from "next/image"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { IconPicker } from "@/components/ui/icon-picker"

export default function SiteContentAdminPage() {
  const dispatch = useDispatch()
  const { data: siteContent, isLoading } = useSelector((state) => state.siteContent)
  const [activeTab, setActiveTab] = useState("founder_message")
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)

  // -- STATES --
  const [founderForm, setFounderForm] = useState({ title: "", content: "", file: null, existingImage: "" })
  const [heroSlides, setHeroSlides] = useState([])
  const [aboutPreview, setAboutPreview] = useState({ title: "", content: "", points: ["", "", "", ""] })
  const [aboutMain, setAboutMain] = useState({ image: "", stats: ["", "", ""], sections: [] })
  const [focusAreas, setFocusAreas] = useState([])
  const [impactStats, setImpactStats] = useState([])

  // New states for major pages
  const [storeInfo, setStoreInfo] = useState({ title: "Our Store / Areas of Impact", content: "" })
  const [faqs, setFaqs] = useState([])
  const [legalPages, setLegalPages] = useState({ privacy: "", terms: "" })
  const [visionMission, setVisionMission] = useState({ vision: "", mission: "", objectives: "" })

  const [contactInfo, setContactInfo] = useState({
    address: "",
    phones: [{ number: "", showInNavbar: true, showInFooter: true, showInContact: true }],
    email: "", facebook: "", instagram: "", twitter: "", youtube: ""
  })

  const [donateDetails, setDonateDetails] = useState({
    bankName: "", accountName: "", accountNumber: "", ifscCode: "", upiId: "", qrImage: ""
  })

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  useEffect(() => {
    if (siteContent) {
      // 1. Founder Message
      if (siteContent.founder_message) {
        setFounderForm({
          title: siteContent.founder_message.title || "",
          content: siteContent.founder_message.content || "",
          file: null,
          existingImage: siteContent.founder_message.image?.url || "",
        })
      }

      // 2. Hero Slider
      if (siteContent.home_hero?.content) {
        try { setHeroSlides(JSON.parse(siteContent.home_hero.content)) } catch (e) { }
      }

      // 3. About Preview (Home)
      if (siteContent.about_preview?.content) {
        try {
          const parsed = JSON.parse(siteContent.about_preview.content)
          setAboutPreview({
            title: siteContent.about_preview.title || "",
            content: parsed.description || "",
            points: parsed.points || ["", "", "", ""]
          })
        } catch (e) { }
      }

      // 4. About Main
      if (siteContent.about_main?.content) {
        try { setAboutMain(JSON.parse(siteContent.about_main.content)) } catch (e) { }
      }

      // 5. Focus Areas
      if (siteContent.focus_areas?.content) {
        try { setFocusAreas(JSON.parse(siteContent.focus_areas.content)) } catch (e) { }
      }

      // 6. Impact Stats
      if (siteContent.impact_stats?.content) {
        try { setImpactStats(JSON.parse(siteContent.impact_stats.content)) } catch (e) { }
      }

      // 7. Store / Areas of Impact
      if (siteContent.store_info?.content) {
        setStoreInfo({ title: siteContent.store_info.title || "", content: siteContent.store_info.content })
      }

      // 8. FAQs
      if (siteContent.faqs?.content) {
        try { setFaqs(JSON.parse(siteContent.faqs.content)) } catch (e) { }
      }

      // 9. Legal Pages
      setLegalPages({
        privacy: siteContent.privacy_policy?.content || "",
        terms: siteContent.terms_conditions?.content || ""
      })

      // 10. Vision / Mission
      if (siteContent.vision_mission?.content) {
        try { setVisionMission(JSON.parse(siteContent.vision_mission.content)) } catch (e) { }
      }

      if (siteContent.contact_info?.content) {
        try {
          const parsed = JSON.parse(siteContent.contact_info.content)
          if (parsed.phone && !parsed.phones) {
            parsed.phones = [{ number: parsed.phone, showInNavbar: true, showInFooter: true, showInContact: true }]
            delete parsed.phone
          }
          if (!parsed.phones) parsed.phones = []
          setContactInfo(parsed)
        } catch (e) { }
      }

      // 12. Donate Details
      if (siteContent.donate_details?.content) {
        try { setDonateDetails(JSON.parse(siteContent.donate_details.content)) } catch (e) { }
      }
    }
  }, [siteContent])

  // -- UPLOAD HELPER --
  const handleFileUpload = async (e, callback, loadingKey) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(loadingKey)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await api.post("/site-content/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      callback(res.data.url)
      toast.success("Image uploaded successfully!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image")
    }
    setUploadingImage(null)
  }

  // -- SAVE HELPERS --
  const saveContent = async (key, title, contentData) => {
    setIsSaving(true)
    try {
      const payload = typeof contentData === 'object' ? JSON.stringify(contentData) : contentData
      await api.post("/site-content", { key, title, content: payload })
      toast.success(`${title} updated successfully!`)
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveFounder = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("key", "founder_message")
      formData.append("title", founderForm.title)
      formData.append("content", founderForm.content)
      if (founderForm.file) formData.append("image", founderForm.file)

      await api.post("/site-content", formData, { headers: { "Content-Type": "multipart/form-data" } })
      toast.success("Founder Message updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  if (isLoading && !siteContent.founder_message) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">Manage Site Content</h1>
        <p className="text-muted-foreground">Update static text, pages, and images across the website.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto gap-2">
          <TabsTrigger value="founder_message">Founder</TabsTrigger>
          <TabsTrigger value="home_hero">Hero Slider</TabsTrigger>
          <TabsTrigger value="about_preview">About (Home)</TabsTrigger>
          <TabsTrigger value="about_main">About (Main)</TabsTrigger>
          <TabsTrigger value="vision_mission">Vision & Mission</TabsTrigger>
          <TabsTrigger value="focus_areas">Focus Areas</TabsTrigger>
          <TabsTrigger value="impact_stats">Impact Stats</TabsTrigger>
          <TabsTrigger value="store_info">Store / Impact</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="legal_pages">Legal (Privacy/Terms)</TabsTrigger>
          <TabsTrigger value="contact_info">Contact Info</TabsTrigger>
          <TabsTrigger value="donate_details">Donate Details</TabsTrigger>
        </TabsList>

        {/* FOUNDER MESSAGE TAB */}
        <TabsContent value="founder_message">
          <Card>
            <CardHeader><CardTitle>Founder's Message</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Heading / Title</label>
                <Input value={founderForm.title} onChange={(e) => setFounderForm({ ...founderForm, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold">Detailed Message</label>
                <Textarea className="min-h-[200px]" value={founderForm.content} onChange={(e) => setFounderForm({ ...founderForm, content: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Founder's Photo</label>
                {founderForm.existingImage && !founderForm.file && (
                  <Image src={founderForm.existingImage} alt="Current" width={100} height={100} className="mb-2 rounded-md object-cover" />
                )}
                <Input type="file" accept="image/*" onChange={(e) => setFounderForm({ ...founderForm, file: e.target.files[0] })} />
              </div>
              <Button onClick={handleSaveFounder} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Founder Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VISION MISSION TAB */}
        <TabsContent value="vision_mission">
          <Card>
            <CardHeader><CardTitle>Vision, Mission & Objectives</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-2">Our Vision</label>
                <RichTextEditor value={visionMission.vision} onChange={val => setVisionMission({ ...visionMission, vision: val })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Our Mission</label>
                <RichTextEditor value={visionMission.mission} onChange={val => setVisionMission({ ...visionMission, mission: val })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Our Objectives</label>
                <RichTextEditor value={visionMission.objectives} onChange={val => setVisionMission({ ...visionMission, objectives: val })} />
              </div>
              <Button onClick={() => saveContent("vision_mission", "Vision & Mission", visionMission)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> Save Vision & Mission
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEGAL PAGES TAB */}
        <TabsContent value="legal_pages">
          <Card>
            <CardHeader><CardTitle>Privacy Policy & Terms</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-2">Privacy Policy</label>
                <RichTextEditor value={legalPages.privacy} onChange={val => setLegalPages({ ...legalPages, privacy: val })} />
                <Button className="mt-2" onClick={() => saveContent("privacy_policy", "Privacy Policy", legalPages.privacy)} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Privacy Policy
                </Button>
              </div>
              <div className="pt-6 border-t">
                <label className="text-sm font-semibold block mb-2">Terms & Conditions</label>
                <RichTextEditor value={legalPages.terms} onChange={val => setLegalPages({ ...legalPages, terms: val })} />
                <Button className="mt-2" onClick={() => saveContent("terms_conditions", "Terms & Conditions", legalPages.terms)} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STORE INFO TAB */}
        <TabsContent value="store_info">
          <Card>
            <CardHeader><CardTitle>Our Store / Areas of Impact</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold">Title</label>
                <Input value={storeInfo.title} onChange={(e) => setStoreInfo({ ...storeInfo, title: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Content / Description</label>
                <RichTextEditor value={storeInfo.content} onChange={val => setStoreInfo({ ...storeInfo, content: val })} />
              </div>
              <Button onClick={() => saveContent("store_info", storeInfo.title, storeInfo.content)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> Save Store Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQS TAB */}
        <TabsContent value="faqs">
          <Card>
            <CardHeader><CardTitle>Frequently Asked Questions (FAQ)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-4 bg-muted/20">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-navy">Question {index + 1}</label>
                      <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input value={faq.q} onChange={(e) => { const newFaqs = [...faqs]; newFaqs[index].q = e.target.value; setFaqs(newFaqs) }} placeholder="Enter the question..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-navy block mb-2">Answer</label>
                    <RichTextEditor value={faq.a} onChange={val => { const newFaqs = [...faqs]; newFaqs[index].a = val; setFaqs(newFaqs) }} />
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>
                  <Plus className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
                <Button onClick={() => saveContent("faqs", "FAQs", faqs)} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" /> Save FAQs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT INFO TAB */}
        <TabsContent value="contact_info">
          <Card>
            <CardHeader><CardTitle>Global Contact Info & Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Phone Numbers</label>
                <div className="space-y-3">
                  {contactInfo.phones?.map((phone, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/20">
                      <div className="flex gap-2 items-center">
                        <Input className="flex-1" value={phone.number} onChange={(e) => {
                          const newPhones = [...contactInfo.phones]
                          newPhones[idx].number = e.target.value
                          setContactInfo({ ...contactInfo, phones: newPhones })
                        }} placeholder="+91 XXXXXXXXXX" />
                        <Button variant="destructive" size="icon" className="shrink-0 h-10 w-10" onClick={() => {
                          const newPhones = [...contactInfo.phones]
                          newPhones.splice(idx, 1)
                          setContactInfo({ ...contactInfo, phones: newPhones })
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm mt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={phone.showInNavbar} onChange={(e) => {
                            const newPhones = [...contactInfo.phones]; newPhones[idx].showInNavbar = e.target.checked; setContactInfo({ ...contactInfo, phones: newPhones })
                          }} /> Show in Navbar
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={phone.showInFooter} onChange={(e) => {
                            const newPhones = [...contactInfo.phones]; newPhones[idx].showInFooter = e.target.checked; setContactInfo({ ...contactInfo, phones: newPhones })
                          }} /> Show in Footer
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={phone.showInContact} onChange={(e) => {
                            const newPhones = [...contactInfo.phones]; newPhones[idx].showInContact = e.target.checked; setContactInfo({ ...contactInfo, phones: newPhones })
                          }} /> Show in Contact Page
                        </label>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setContactInfo({ ...contactInfo, phones: [...(contactInfo.phones || []), { number: "", showInNavbar: true, showInFooter: true, showInContact: true }] })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Phone Number
                  </Button>
                </div>
              </div>

              <div><label className="text-sm font-semibold">Email Address</label><Input value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="info@example.com" /></div>
              <div><label className="text-sm font-semibold">Office Address</label><Textarea value={contactInfo.address} onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })} /></div>

              <h4 className="font-bold pt-4">Social Media Links</h4>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold">Facebook URL</label><Input value={contactInfo.facebook} onChange={e => setContactInfo({ ...contactInfo, facebook: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">Instagram URL</label><Input value={contactInfo.instagram} onChange={e => setContactInfo({ ...contactInfo, instagram: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">Twitter URL</label><Input value={contactInfo.twitter} onChange={e => setContactInfo({ ...contactInfo, twitter: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">YouTube URL</label><Input value={contactInfo.youtube} onChange={e => setContactInfo({ ...contactInfo, youtube: e.target.value })} /></div>
              </div>

              <Button onClick={() => saveContent("contact_info", "Contact Info", contactInfo)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> Save Contact Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DONATE DETAILS TAB */}
        <TabsContent value="donate_details">
          <Card>
            <CardHeader><CardTitle>Donate Page Details (Bank & QR)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold">Bank Name</label><Input value={donateDetails.bankName} onChange={e => setDonateDetails({ ...donateDetails, bankName: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">Account Name</label><Input value={donateDetails.accountName} onChange={e => setDonateDetails({ ...donateDetails, accountName: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">Account Number</label><Input value={donateDetails.accountNumber} onChange={e => setDonateDetails({ ...donateDetails, accountNumber: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">IFSC Code</label><Input value={donateDetails.ifscCode} onChange={e => setDonateDetails({ ...donateDetails, ifscCode: e.target.value })} /></div>
                <div><label className="text-sm font-semibold">UPI ID</label><Input value={donateDetails.upiId} onChange={e => setDonateDetails({ ...donateDetails, upiId: e.target.value })} /></div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">UPI QR Code Image</label>
                <div className="flex gap-4 items-center">
                  {donateDetails.qrImage && <Image src={donateDetails.qrImage} width={100} height={100} className="rounded-md border p-1" alt="QR" />}
                  <div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setDonateDetails({ ...donateDetails, qrImage: url }), "qr_image")} />
                    {uploadingImage === "qr_image" && <Loader2 className="animate-spin h-5 w-5 text-accent mt-2" />}
                  </div>
                </div>
              </div>
              <Button onClick={() => saveContent("donate_details", "Donate Details", donateDetails)} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> Save Donate Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Existing HERO, ABOUT, FOCUS, STATS (kept the same, code omitted for brevity but included here) */}
        {/* HERO SLIDER TAB */}
        <TabsContent value="home_hero">
          <Card>
            <CardHeader><CardTitle>Hero Slider (Homepage)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <Button variant="destructive" size="icon" className="absolute right-4 top-4" onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
                  <h4 className="font-semibold text-accent">Slide {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold">Normal Title</label><Input value={slide.title} onChange={(e) => { const newS = [...heroSlides]; newS[index].title = e.target.value; setHeroSlides(newS) }} /></div>
                    <div><label className="text-xs font-semibold">Highlighted Title</label><Input value={slide.highlight} onChange={(e) => { const newS = [...heroSlides]; newS[index].highlight = e.target.value; setHeroSlides(newS) }} /></div>
                  </div>
                  <div><label className="text-xs font-semibold">Description</label><Textarea value={slide.desc} onChange={(e) => { const newS = [...heroSlides]; newS[index].desc = e.target.value; setHeroSlides(newS) }} /></div>
                  <div>
                    <label className="text-xs font-semibold">Image</label>
                    <div className="flex gap-2 items-center mt-1">
                      {slide.image && <Image src={slide.image} width={40} height={40} className="rounded object-cover h-10 w-10 shrink-0 border" alt="preview" />}
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const newS = [...heroSlides]; newS[index].image = url; setHeroSlides(newS) }, `hero_${index}`)} />
                      {uploadingImage === `hero_${index}` && <Loader2 className="animate-spin h-4 w-4 shrink-0 text-accent" />}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setHeroSlides([...heroSlides, { title: "", highlight: "", desc: "", image: "" }])}><Plus className="mr-2 h-4 w-4" /> Add Slide</Button>
                <Button onClick={() => saveContent("home_hero", "Hero Slider", heroSlides)} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save Hero Slider</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PREVIEW TAB */}
        <TabsContent value="about_preview">
          <Card>
            <CardHeader><CardTitle>About Section (Homepage)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-semibold">Heading</label><Input value={aboutPreview.title} onChange={(e) => setAboutPreview({ ...aboutPreview, title: e.target.value })} /></div>
              <div><label className="text-sm font-semibold">Description</label><Textarea className="min-h-[100px]" value={aboutPreview.content} onChange={(e) => setAboutPreview({ ...aboutPreview, content: e.target.value })} /></div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Bullet Points</label>
                {aboutPreview.points.map((point, index) => (
                  <Input key={index} value={point} onChange={(e) => {
                    const newP = [...aboutPreview.points]; newP[index] = e.target.value; setAboutPreview({ ...aboutPreview, points: newP });
                  }} />
                ))}
              </div>
              <Button onClick={() => saveContent("about_preview", aboutPreview.title, { description: aboutPreview.content, points: aboutPreview.points.filter(p => p.trim() !== "") })} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save About Section</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT MAIN PAGE TAB */}
        <TabsContent value="about_main">
          <Card>
            <CardHeader><CardTitle>About Us (Main Page)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold">Side Image</label>
                <div className="flex gap-2 items-center mt-1">
                  {aboutMain.image && <Image src={aboutMain.image} width={60} height={60} className="rounded object-cover h-14 w-14 shrink-0 border" alt="preview" />}
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutMain({ ...aboutMain, image: url }), "about_main")} />
                  {uploadingImage === "about_main" && <Loader2 className="animate-spin h-5 w-5 shrink-0 text-accent" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Blue Button Tags (3 Max)</label>
                <div className="grid grid-cols-3 gap-2">
                  {aboutMain.stats.map((stat, idx) => (
                    <Input key={idx} value={stat} onChange={(e) => {
                      const newStats = [...aboutMain.stats]; newStats[idx] = e.target.value; setAboutMain({ ...aboutMain, stats: newStats });
                    }} />
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <label className="text-sm font-semibold">Content Sections</label>
                {aboutMain.sections.map((section, idx) => (
                  <div key={idx} className="p-4 border rounded-xl space-y-4 bg-muted/20">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-navy">Section {idx + 1} Heading</label>
                        <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => setAboutMain({ ...aboutMain, sections: aboutMain.sections.filter((_, i) => i !== idx) })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input value={section[0]} onChange={(e) => { const newS = [...aboutMain.sections]; newS[idx][0] = e.target.value; setAboutMain({ ...aboutMain, sections: newS }) }} placeholder="Enter heading..." />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-2">Paragraph</label>
                      <RichTextEditor value={section[1]} onChange={(val) => { const newS = [...aboutMain.sections]; newS[idx][1] = val; setAboutMain({ ...aboutMain, sections: newS }) }} />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setAboutMain({ ...aboutMain, sections: [...aboutMain.sections, ["", ""]] })}><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
                  <Button onClick={() => saveContent("about_main", "About Us (Main Page)", aboutMain)} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save About Page Content</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOCUS AREAS TAB */}
        <TabsContent value="focus_areas">
          <Card>
            <CardHeader><CardTitle>Focus Areas (Homepage)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {focusAreas.map((area, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <Button variant="destructive" size="icon" className="absolute right-4 top-4" onClick={() => setFocusAreas(focusAreas.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
                  <h4 className="font-semibold text-accent">Area {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold block mb-1">Title</label><Input value={area.title} onChange={(e) => { const newA = [...focusAreas]; newA[index].title = e.target.value; setFocusAreas(newA) }} /></div>
                    <div><label className="text-xs font-semibold block mb-1">Icon</label><IconPicker value={area.icon} onChange={(val) => { const newA = [...focusAreas]; newA[index].icon = val; setFocusAreas(newA) }} /></div>
                  </div>
                  <div><label className="text-xs font-semibold">Description</label><Textarea value={area.desc} onChange={(e) => { const newA = [...focusAreas]; newA[index].desc = e.target.value; setFocusAreas(newA) }} /></div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Image</label>
                      <div className="flex gap-2 items-center mt-1">
                        {area.image && <Image src={area.image} width={40} height={40} className="rounded object-cover h-10 w-10 shrink-0 border" alt="preview" />}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const newA = [...focusAreas]; newA[index].image = url; setFocusAreas(newA) }, `focus_${index}`)} />
                        {uploadingImage === `focus_${index}` && <Loader2 className="animate-spin h-4 w-4 shrink-0 text-accent" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setFocusAreas([...focusAreas, { title: "", desc: "", image: "", icon: "" }])}><Plus className="mr-2 h-4 w-4" /> Add Area</Button>
                <Button onClick={() => saveContent("focus_areas", "Focus Areas", focusAreas)} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save Focus Areas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMPACT STATS TAB */}
        <TabsContent value="impact_stats">
          <Card>
            <CardHeader><CardTitle>Impact Stats (Numbers)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <Button variant="destructive" size="icon" className="absolute right-4 top-4" onClick={() => setImpactStats(impactStats.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button>
                  <h4 className="font-semibold text-accent">Stat {index + 1}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-xs font-semibold block mb-1">Value (Number)</label><Input value={stat.value} onChange={(e) => { const newS = [...impactStats]; newS[index].value = e.target.value; setImpactStats(newS) }} /></div>
                    <div><label className="text-xs font-semibold block mb-1">Label (Text)</label><Input value={stat.label} onChange={(e) => { const newS = [...impactStats]; newS[index].label = e.target.value; setImpactStats(newS) }} /></div>
                    <div><label className="text-xs font-semibold block mb-1">Icon</label><IconPicker value={stat.icon} onChange={(val) => { const newS = [...impactStats]; newS[index].icon = val; setImpactStats(newS) }} /></div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setImpactStats([...impactStats, { value: "", label: "", icon: "" }])}><Plus className="mr-2 h-4 w-4" /> Add Stat</Button>
                <Button onClick={() => saveContent("impact_stats", "Impact Stats", impactStats)} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save Impact Stats</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
