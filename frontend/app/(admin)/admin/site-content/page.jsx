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

export default function SiteContentAdminPage() {
  const dispatch = useDispatch()
  const { data: siteContent, isLoading } = useSelector((state) => state.siteContent)
  const [activeTab, setActiveTab] = useState("founder_message")
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAboutMain = async () => {
    setIsSaving(true)
    try {
      await api.post("/site-content", {
        key: "about_main",
        title: "About Us (Main Page)",
        content: JSON.stringify(aboutMain)
      })
      toast.success("About Main Page updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const [uploadingImage, setUploadingImage] = useState(null)

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

  // Local state for forms
  const [founderForm, setFounderForm] = useState({ title: "", content: "", file: null, existingImage: "" })
  const [heroSlides, setHeroSlides] = useState([])
  const [aboutPreview, setAboutPreview] = useState({ title: "", content: "", points: ["", "", "", ""] })
  const [aboutMain, setAboutMain] = useState({ 
    image: "", 
    stats: ["", "", ""], 
    sections: [] 
  })
  const [focusAreas, setFocusAreas] = useState([])
  const [impactStats, setImpactStats] = useState([])

  useEffect(() => {
    dispatch(fetchSiteContent())
  }, [dispatch])

  // Populate local states when data loads
  useEffect(() => {
    if (siteContent) {
      // Founder Message
      if (siteContent.founder_message) {
        setFounderForm({
          title: siteContent.founder_message.title || "",
          content: siteContent.founder_message.content || "",
          file: null,
          existingImage: siteContent.founder_message.image?.url || "",
        })
      }

      // Hero Slider (stored as JSON array in content)
      if (siteContent.home_hero?.content) {
        try {
          setHeroSlides(JSON.parse(siteContent.home_hero.content))
        } catch (e) {
          setHeroSlides([])
        }
      } else {
        setHeroSlides([
          {
            image: "/hero-community-education-india.png",
            title: "Empowering lives,",
            highlight: "shaping futures.",
            desc: "Real Human Trust is dedicated to uplifting underprivileged communities through quality education, accessible healthcare, and sustainable empowerment programs across India."
          },
          {
            image: "/community-health-camp-india.png",
            title: "Compassionate care,",
            highlight: "for everyone.",
            desc: "Providing essential medical camps, life-saving healthcare access, and nutritional support to those who need it the most in rural and urban areas."
          },
          {
            image: "/women-skill-training-workshop-india.png",
            title: "Building skills,",
            highlight: "creating leaders.",
            desc: "Empowering women and youth through vocational training, financial literacy, and entrepreneurship programs to build self-reliant futures."
          },
          {
            image: "/about-volunteers-india.png",
            title: "Together we can,",
            highlight: "make a difference.",
            desc: "Join thousands of dedicated volunteers and supporters in our mission to bring hope, dignity, and opportunity to marginalized communities."
          }
        ])
      }

      // About Preview
      if (siteContent.about_preview?.content) {
        try {
          const parsed = JSON.parse(siteContent.about_preview.content)
          setAboutPreview({
            title: siteContent.about_preview.title || "",
            content: parsed.description || "",
            points: parsed.points || ["", "", "", ""]
          })
        } catch (e) {}
      } else {
        setAboutPreview({
          title: "A grassroots movement for education & human dignity",
          content: "Founded in Rajkot, Gujarat, Real Human Education & Charitable Trust works at the intersection of education, health and empowerment. We believe every person deserves the chance to learn, grow and live with dignity regardless of where they were born.",
          points: [
            "Free education & school sponsorship for underprivileged children",
            "Healthcare camps, mobile units & medicine distribution",
            "Women empowerment through skill development",
            "Daily community kitchen & disaster relief",
          ]
        })
      }

      // About Main (About Page)
      if (siteContent.about_main?.content) {
        try {
          setAboutMain(JSON.parse(siteContent.about_main.content))
        } catch (e) {}
      } else {
        setAboutMain({
          image: "/about-volunteers-india.png",
          stats: ["Gujarat Based", "Public Welfare", "Volunteer Powered"],
          sections: [
            [
              "Our Story",
              "Real Human Education & Charitable Trust began with a simple but profound belief: every individual, regardless of their background, deserves access to quality education, proper healthcare, and the opportunity to live with dignity. Based in Rajkot, Gujarat, we have grown from a small group of passionate volunteers into a structured, community-driven NGO that actively addresses the most pressing needs of underprivileged families.",
            ],
            [
              "Our Approach",
              "We believe in practical, on-the-ground interventions. Whether it is distributing school supplies to children who cannot afford them, setting up mobile health camps in remote villages, or providing vocational training for women, our approach is always direct, transparent, and measurable. We do not just provide temporary relief; we strive to create sustainable ecosystems where communities can eventually thrive independently.",
            ],
            [
              "Transparency & Trust",
              "Trust is the foundation of everything we do. As a registered charitable trust, we maintain absolute transparency with our donors and members. Every rupee contributed goes directly into our field programs, and we regularly publish audit reports and field updates. When you support Real Human Trust, you know exactly whose life you are changing.",
            ],
          ]
        })
      }

      // Focus Areas
      if (siteContent.focus_areas?.content) {
        try {
          setFocusAreas(JSON.parse(siteContent.focus_areas.content))
        } catch (e) {
          setFocusAreas([])
        }
      } else {
        setFocusAreas([
          {
            icon: "GraduationCap",
            title: "Education",
            desc: "Free coaching centres, school sponsorships, books and digital learning for children in need.",
            image: "/rural-classroom-children-learning-india.png",
            color: "from-blue-600/80 to-navy/90",
          },
          {
            icon: "HeartPulse",
            title: "Healthcare",
            desc: "Medical camps, mobile health units and awareness drives bringing care to remote villages.",
            image: "/community-health-camp-india.png",
            color: "from-rose-600/80 to-navy/90",
          },
          {
            icon: "Apple",
            title: "Nutrition",
            desc: "Community kitchens serving daily nutritious meals to the hungry and vulnerable.",
            image: "/community-kitchen-serving-food-india.png",
            color: "from-orange-600/80 to-navy/90",
          },
          {
            icon: "Users2",
            title: "Empowerment",
            desc: "Skill development and micro-enterprise training that helps women stand independently.",
            image: "/women-skill-training-workshop-india.png",
            color: "from-violet-600/80 to-navy/90",
          },
          {
            icon: "TreePine",
            title: "Environment",
            desc: "Tree plantation and sustainability drives for a greener, healthier tomorrow.",
            image: "/tree-plantation-volunteers-india.png",
            color: "from-emerald-600/80 to-navy/90",
          },
          {
            icon: "Sprout",
            title: "Relief & Welfare",
            desc: "Rapid disaster relief, ration kits and support for families during times of crisis.",
            image: "/about-volunteers-india.png",
            color: "from-amber-600/80 to-navy/90",
          },
        ])
      }

      // Impact Stats
      if (siteContent.impact_stats?.content) {
        try {
          setImpactStats(JSON.parse(siteContent.impact_stats.content))
        } catch (e) {
          setImpactStats([])
        }
      } else {
        setImpactStats([
          { value: "25,000+", label: "Lives Impacted", icon: "Users" },
          { value: "80G & 12A", label: "Govt. Certified", icon: "ShieldCheck" }
        ])
      }
    }
  }, [siteContent])

  const handleSaveFounder = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("key", "founder_message")
      formData.append("title", founderForm.title)
      formData.append("content", founderForm.content)
      if (founderForm.file) formData.append("image", founderForm.file)

      await api.post("/site-content", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success("Founder Message updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveHero = async () => {
    setIsSaving(true)
    try {
      await api.post("/site-content", {
        key: "home_hero",
        title: "Homepage Hero Slider",
        content: JSON.stringify(heroSlides)
      })
      toast.success("Hero Slider updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveAbout = async () => {
    setIsSaving(true)
    try {
      await api.post("/site-content", {
        key: "about_preview",
        title: aboutPreview.title,
        content: JSON.stringify({
          description: aboutPreview.content,
          points: aboutPreview.points.filter(p => p.trim() !== "")
        })
      })
      toast.success("About Section updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveFocus = async () => {
    setIsSaving(true)
    try {
      await api.post("/site-content", {
        key: "focus_areas",
        title: "Focus Areas",
        content: JSON.stringify(focusAreas)
      })
      toast.success("Focus Areas updated successfully!")
      dispatch(fetchSiteContent())
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update")
    }
    setIsSaving(false)
  }

  const handleSaveStats = async () => {
    setIsSaving(true)
    try {
      await api.post("/site-content", {
        key: "impact_stats",
        title: "Impact Stats",
        content: JSON.stringify(impactStats)
      })
      toast.success("Impact Stats updated successfully!")
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
        <p className="text-muted-foreground">Update static text, headings, and images across the website.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="founder_message">Founder Message</TabsTrigger>
          <TabsTrigger value="home_hero">Hero Slider</TabsTrigger>
          <TabsTrigger value="about_preview">About Us (Home)</TabsTrigger>
          <TabsTrigger value="about_main">About Us (Main Page)</TabsTrigger>
          <TabsTrigger value="focus_areas">Focus Areas</TabsTrigger>
          <TabsTrigger value="impact_stats">Impact Stats</TabsTrigger>
        </TabsList>

        {/* FOUNDER MESSAGE TAB */}
        <TabsContent value="founder_message">
          <Card>
            <CardHeader>
              <CardTitle>Founder's Message</CardTitle>
              <CardDescription>This appears on the dedicated Founder's Message page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Heading / Title</label>
                <Input 
                  value={founderForm.title} 
                  onChange={(e) => setFounderForm({...founderForm, title: e.target.value})} 
                  placeholder="e.g. Message from our Founder" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Detailed Message (Paragraphs)</label>
                <Textarea 
                  className="min-h-[200px]"
                  value={founderForm.content} 
                  onChange={(e) => setFounderForm({...founderForm, content: e.target.value})} 
                  placeholder="Type the message here..." 
                />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Founder's Photo</label>
                {founderForm.existingImage && !founderForm.file && (
                  <Image src={founderForm.existingImage} alt="Current" width={100} height={100} className="mb-2 rounded-md object-cover" />
                )}
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFounderForm({...founderForm, file: e.target.files[0]})} 
                />
              </div>
              <Button onClick={handleSaveFounder} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Founder Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HERO SLIDER TAB */}
        <TabsContent value="home_hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Slider (Homepage)</CardTitle>
              <CardDescription>Manage the main banner slides on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <div className="absolute right-4 top-4">
                    <Button variant="destructive" size="icon" onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== index))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="font-semibold text-accent">Slide {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold">Normal Title</label>
                      <Input value={slide.title} onChange={(e) => { const newS = [...heroSlides]; newS[index].title = e.target.value; setHeroSlides(newS) }} placeholder="Empowering lives," />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Highlighted Title (Italic)</label>
                      <Input value={slide.highlight} onChange={(e) => { const newS = [...heroSlides]; newS[index].highlight = e.target.value; setHeroSlides(newS) }} placeholder="shaping futures." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Description</label>
                    <Textarea value={slide.desc} onChange={(e) => { const newS = [...heroSlides]; newS[index].desc = e.target.value; setHeroSlides(newS) }} />
                  </div>
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
                <Button variant="outline" onClick={() => setHeroSlides([...heroSlides, { title: "", highlight: "", desc: "", image: "" }])}>
                  <Plus className="mr-2 h-4 w-4" /> Add Slide
                </Button>
                <Button onClick={handleSaveHero} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Hero Slider
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PREVIEW TAB */}
        <TabsContent value="about_preview">
          <Card>
            <CardHeader>
              <CardTitle>About Section (Homepage)</CardTitle>
              <CardDescription>Manage the "Who We Are" preview on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Heading</label>
                <Input value={aboutPreview.title} onChange={(e) => setAboutPreview({...aboutPreview, title: e.target.value})} placeholder="A grassroots movement..." />
              </div>
              <div>
                <label className="text-sm font-semibold">Description</label>
                <Textarea className="min-h-[100px]" value={aboutPreview.content} onChange={(e) => setAboutPreview({...aboutPreview, content: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Bullet Points (Features/Services)</label>
                {aboutPreview.points.map((point, index) => (
                  <Input key={index} value={point} onChange={(e) => {
                    const newP = [...aboutPreview.points]; newP[index] = e.target.value; setAboutPreview({...aboutPreview, points: newP});
                  }} placeholder={`Point ${index + 1}`} />
                ))}
              </div>
              <Button onClick={handleSaveAbout} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save About Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT MAIN PAGE TAB */}
        <TabsContent value="about_main">
          <Card>
            <CardHeader>
              <CardTitle>About Us (Main Page)</CardTitle>
              <CardDescription>Manage the detailed content on the dedicated About page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-semibold">Side Image</label>
                <div className="flex gap-2 items-center mt-1">
                  {aboutMain.image && <Image src={aboutMain.image} width={60} height={60} className="rounded object-cover h-14 w-14 shrink-0 border" alt="preview" />}
                  <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setAboutMain({...aboutMain, image: url}), "about_main")} />
                  {uploadingImage === "about_main" && <Loader2 className="animate-spin h-5 w-5 shrink-0 text-accent" />}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Blue Button Tags (3 Max)</label>
                <div className="grid grid-cols-3 gap-2">
                  {aboutMain.stats.map((stat, idx) => (
                    <Input key={idx} value={stat} onChange={(e) => {
                      const newStats = [...aboutMain.stats]; newStats[idx] = e.target.value; setAboutMain({...aboutMain, stats: newStats});
                    }} placeholder={`Tag ${idx + 1}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <label className="text-sm font-semibold">Content Sections</label>
                {aboutMain.sections.map((section, idx) => (
                  <div key={idx} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                    <div className="absolute right-4 top-4">
                      <Button variant="destructive" size="icon" onClick={() => setAboutMain({...aboutMain, sections: aboutMain.sections.filter((_, i) => i !== idx)})}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Heading</label>
                      <Input value={section[0]} onChange={(e) => { const newS = [...aboutMain.sections]; newS[idx][0] = e.target.value; setAboutMain({...aboutMain, sections: newS}) }} placeholder="e.g. Our Story" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Paragraph</label>
                      <Textarea className="min-h-[100px]" value={section[1]} onChange={(e) => { const newS = [...aboutMain.sections]; newS[idx][1] = e.target.value; setAboutMain({...aboutMain, sections: newS}) }} placeholder="Write content..." />
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setAboutMain({...aboutMain, sections: [...aboutMain.sections, ["", ""]]})}>
                    <Plus className="mr-2 h-4 w-4" /> Add Section
                  </Button>
                  <Button onClick={handleSaveAboutMain} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save About Page Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOCUS AREAS TAB */}
        <TabsContent value="focus_areas">
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas (Homepage)</CardTitle>
              <CardDescription>Manage the 6 focus area cards and their details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {focusAreas.map((area, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <div className="absolute right-4 top-4">
                    <Button variant="destructive" size="icon" onClick={() => setFocusAreas(focusAreas.filter((_, i) => i !== index))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="font-semibold text-accent">Area {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold">Title</label>
                      <Input value={area.title} onChange={(e) => { const newA = [...focusAreas]; newA[index].title = e.target.value; setFocusAreas(newA) }} placeholder="Education" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Lucide Icon Name</label>
                      <Input value={area.icon} onChange={(e) => { const newA = [...focusAreas]; newA[index].icon = e.target.value; setFocusAreas(newA) }} placeholder="GraduationCap" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Description</label>
                    <Textarea value={area.desc} onChange={(e) => { const newA = [...focusAreas]; newA[index].desc = e.target.value; setFocusAreas(newA) }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold">Image</label>
                      <div className="flex gap-2 items-center mt-1">
                        {area.image && <Image src={area.image} width={40} height={40} className="rounded object-cover h-10 w-10 shrink-0 border" alt="preview" />}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => { const newA = [...focusAreas]; newA[index].image = url; setFocusAreas(newA) }, `focus_${index}`)} />
                        {uploadingImage === `focus_${index}` && <Loader2 className="animate-spin h-4 w-4 shrink-0 text-accent" />}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Tailwind Gradient Classes</label>
                      <Input value={area.color} onChange={(e) => { const newA = [...focusAreas]; newA[index].color = e.target.value; setFocusAreas(newA) }} placeholder="from-blue-600/80 to-navy/90" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setFocusAreas([...focusAreas, { title: "", desc: "", image: "", icon: "", color: "from-blue-600/80 to-navy/90" }])}>
                  <Plus className="mr-2 h-4 w-4" /> Add Area
                </Button>
                <Button onClick={handleSaveFocus} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Focus Areas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMPACT STATS TAB */}
        <TabsContent value="impact_stats">
          <Card>
            <CardHeader>
              <CardTitle>Impact Stats (Numbers)</CardTitle>
              <CardDescription>Manage the quick statistics shown on the Hero banner and About page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {impactStats.map((stat, index) => (
                <div key={index} className="p-4 border rounded-xl space-y-3 bg-muted/20 relative">
                  <div className="absolute right-4 top-4">
                    <Button variant="destructive" size="icon" onClick={() => setImpactStats(impactStats.filter((_, i) => i !== index))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="font-semibold text-accent">Stat {index + 1}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold">Value (Number)</label>
                      <Input value={stat.value} onChange={(e) => { const newS = [...impactStats]; newS[index].value = e.target.value; setImpactStats(newS) }} placeholder="25,000+" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Label (Text)</label>
                      <Input value={stat.label} onChange={(e) => { const newS = [...impactStats]; newS[index].label = e.target.value; setImpactStats(newS) }} placeholder="Lives Impacted" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold">Lucide Icon Name</label>
                      <Input value={stat.icon} onChange={(e) => { const newS = [...impactStats]; newS[index].icon = e.target.value; setImpactStats(newS) }} placeholder="Users" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setImpactStats([...impactStats, { value: "", label: "", icon: "" }])}>
                  <Plus className="mr-2 h-4 w-4" /> Add Stat
                </Button>
                <Button onClick={handleSaveStats} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Impact Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
