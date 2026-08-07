"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Newspaper } from "lucide-react"
import { getNewsById } from "@/service/news.service"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return

    getNewsById(params.id)
      .then(data => {
        if (data.success && data.news.status === "published") {
          setNews(data.news)
        } else {
          router.push("/news")
        }
      })
      .catch(err => {
        console.error(err)
        router.push("/news")
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="size-12 animate-spin rounded-full border-4 border-navy border-t-transparent"></div>
      </div>
    )
  }

  if (!news) return null

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-navy py-12 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="mb-8 inline-flex items-center text-sm font-semibold text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to News
          </Link>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-wider text-accent">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <Tag className="size-4" /> {news.category?.replace("_", " ")}
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <Calendar className="size-4" />
              {new Date(news.publishedAt || news.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {news.title}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Optional Image */}
        {news.image?.url && (
          <div className="mb-12 overflow-hidden rounded-3xl shadow-xl shadow-navy/5">
            <Image 
              src={news.image.url} 
              alt={news.title}
              width={1200}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-accent">
          {/* We render the description. If it contains HTML, we could use dangerouslySetInnerHTML, but assuming it's text/markdown for now. Since it's a textarea, we can split by newline. */}
          {news.description.split('\n').map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Footer/Share section could go here */}
        <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-8">
          <Link href="/news" className="inline-flex items-center font-bold text-navy hover:text-accent transition-colors">
            <ArrowLeft className="mr-2 size-5" /> View all news
          </Link>
        </div>
      </div>
    </article>
  )
}
