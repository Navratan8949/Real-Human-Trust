"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, FolderKanban, IndianRupee, Users, Loader2, AlertCircle, ArrowRight, PlusCircle, CalendarPlus, Newspaper, MessageSquare, Activity, CheckCircle2 } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { StatsCard } from "@/components/admin/stats-card"
import api from "@/service/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const SOLID_COLORS = ['#0f172a', '#2563eb', '#059669', '#7c3aed', '#d97706', '#dc2626', '#0891b2'];

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats")
        setData(res.data.stats)
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-navy" />
          <p className="text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl bg-rose-50 p-6 text-center text-rose-700 border border-rose-200">
          <AlertCircle className="mx-auto mb-2 size-8" />
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    )
  }

  const { overview, actionableAlerts, crowdfunding, monthlyTrends, activityFeed, analytics } = data
  const totalPendingActions = (actionableAlerts.pendingMembers.count + actionableAlerts.pendingDonations.count + actionableAlerts.pendingVolunteers.count + actionableAlerts.openComplaints.count)

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Quick Action Hub */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <AdminPageHeader 
          title="Dashboard" 
          description="Live overview of NGO activities, real-time analytics & key management actions." 
          className="pb-0 border-none"
        />

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-navy/90"
          >
            <CalendarPlus className="size-3.5" />
            Add Event
          </Link>

          <Link
            href="/admin/crowdfunding"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
          >
            <PlusCircle className="size-3.5" />
            New Campaign
          </Link>

          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50"
          >
            <MessageSquare className="size-3.5 text-accent" />
            Add Testimonial
          </Link>

          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-navy transition hover:bg-slate-50"
          >
            <Newspaper className="size-3.5 text-blue-600" />
            Post News
          </Link>
        </div>
      </div>
      
      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard 
          label="Total members" 
          value={overview.members.total.toLocaleString("en-IN")} 
          hint={`${overview.members.approved} approved`} 
          icon={Users} 
          tone="bg-blue-50 text-blue-700" 
        />
        <StatsCard 
          label="Donations" 
          value={`₹${overview.donations.totalAmount.toLocaleString("en-IN")}`} 
          hint={`${overview.donations.count} successful payments`} 
          icon={IndianRupee} 
          tone="bg-emerald-50 text-emerald-700" 
        />
        <StatsCard 
          label="Active projects" 
          value={overview.projects.active.toString()} 
          hint={`${overview.projects.total} total projects`} 
          icon={FolderKanban} 
          tone="bg-violet-50 text-violet-700" 
        />
        <StatsCard 
          label="Pending actions" 
          value={totalPendingActions.toString()} 
          hint="Requires admin review" 
          icon={Clock} 
          tone="bg-amber-50 text-amber-700" 
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Charts & Campaigns */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Monthly Trends Bar Chart */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-navy">Donation Trends</h2>
                <p className="text-xs text-muted-foreground">Monthly collection overview (Last 6 Months)</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">INR (₹)</span>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 15, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F1F5F9' }} 
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                    formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Collected"]} 
                  />
                  <Bar dataKey="amount" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Analytics: Purpose & Projects Breakdown */}
          <div className="grid gap-6 sm:grid-cols-2">
            
            {/* Donations by Purpose Pie Chart */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <h2 className="font-serif text-base font-semibold text-navy">Donations by Purpose</h2>
              <p className="text-xs text-muted-foreground mb-2">Category distribution</p>
              <div className="h-[220px] w-full">
                {analytics?.donationsByPurpose?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.donationsByPurpose}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analytics.donationsByPurpose.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SOLID_COLORS[index % SOLID_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]} />
                      <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-xs text-muted-foreground">
                    <span>No donation category data yet.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Projects Distribution Donut Chart */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <h2 className="font-serif text-base font-semibold text-navy">Projects Distribution</h2>
              <p className="text-xs text-muted-foreground mb-2">Active vs Completed initiatives</p>
              <div className="h-[220px] w-full">
                {analytics?.projectDistribution?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.projectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analytics.projectDistribution.map((entry, index) => (
                          <Cell key={`cell-proj-${index}`} fill={SOLID_COLORS[(index + 2) % SOLID_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value} projects`, "Count"]} />
                      <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-xs text-muted-foreground">
                    <span>No project data recorded.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Active Campaigns Tracking */}
          {crowdfunding?.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-navy">Active Crowdfunding</h2>
                  <p className="text-xs text-muted-foreground">Live fundraising goals</p>
                </div>
                <Link href="/admin/crowdfunding" className="text-xs font-semibold text-accent hover:underline">View all campaigns</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {crowdfunding.map(camp => {
                  const percent = Math.min(Math.round((camp.raisedAmount / camp.targetAmount) * 100), 100)
                  return (
                    <div key={camp._id} className="rounded-xl border border-border/60 bg-slate-50 p-4">
                      <h3 className="line-clamp-1 font-semibold text-navy">{camp.title}</h3>
                      <div className="mt-3 flex justify-between text-xs text-muted-foreground mb-1">
                        <span className="font-semibold text-navy">₹{camp.raisedAmount.toLocaleString("en-IN")}</span>
                        <span>Goal: ₹{camp.targetAmount.toLocaleString("en-IN")} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-navy transition-all duration-500" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Activity Stream & Action Required */}
        <div className="space-y-6">
          
          {/* Action Required Checklist */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/40 p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-base font-semibold text-amber-900 flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600" /> Action Required
            </h2>
            
            <div className="space-y-3">
              {/* Pending Members */}
              {actionableAlerts.pendingMembers.count > 0 && (
                <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm transition hover:border-amber-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-navy">{actionableAlerts.pendingMembers.count} Member Approvals</span>
                      <p className="text-[11px] text-muted-foreground">New membership requests</p>
                    </div>
                    <Link href="/admin/members" className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-navy hover:bg-slate-200"><ArrowRight className="size-3.5" /></Link>
                  </div>
                </div>
              )}

              {/* Pending Donations */}
              {actionableAlerts.pendingDonations.count > 0 && (
                <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm transition hover:border-amber-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-navy">{actionableAlerts.pendingDonations.count} Manual Donations</span>
                      <p className="text-[11px] text-muted-foreground">Payment verification needed</p>
                    </div>
                    <Link href="/admin/donations" className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-navy hover:bg-slate-200"><ArrowRight className="size-3.5" /></Link>
                  </div>
                </div>
              )}

              {/* Pending Volunteers */}
              {actionableAlerts.pendingVolunteers.count > 0 && (
                <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm transition hover:border-amber-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-navy">{actionableAlerts.pendingVolunteers.count} Volunteer Apps</span>
                      <p className="text-[11px] text-muted-foreground">Applications pending review</p>
                    </div>
                    <Link href="/admin/volunteers" className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-navy hover:bg-slate-200"><ArrowRight className="size-3.5" /></Link>
                  </div>
                </div>
              )}

              {/* Open Complaints */}
              {actionableAlerts.openComplaints.count > 0 && (
                <div className="rounded-xl border border-rose-200 bg-white p-3 shadow-sm transition hover:border-rose-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-rose-700">{actionableAlerts.openComplaints.count} Open Complaints</span>
                      <p className="text-[11px] text-rose-600/80">Requires resolution</p>
                    </div>
                    <Link href="/admin/complaints" className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"><ArrowRight className="size-3.5" /></Link>
                  </div>
                </div>
              )}

              {/* All Clear */}
              {totalPendingActions === 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-800">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>You're all caught up! No pending approvals or alerts.</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-base font-semibold text-navy flex items-center gap-2">
              <Activity className="size-4 text-navy" /> Recent Activity
            </h2>

            {activityFeed?.length > 0 ? (
              <div className="space-y-4">
                {activityFeed.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      {act.type === 'member' && <Users className="size-3.5" />}
                      {act.type === 'donation' && <IndianRupee className="size-3.5" />}
                      {act.type === 'complaint' && <MessageSquare className="size-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy truncate">{act.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {act.time ? new Date(act.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </p>
                    </div>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-600">
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No recent activity logged yet.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

