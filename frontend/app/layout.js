import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { SplashScreen } from "@/components/splash-screen/splash-screen"
import { ReduxProvider } from "@/redux/Provider"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://realhumantrust.org"

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Real Human Education & Charitable Trust | Non-Profit NGO in Gujarat",
    template: "%s | Real Human Trust",
  },
  description:
    "Real Human Education & Charitable Trust is a registered NGO in Rajkot, Gujarat dedicated to empowering underprivileged communities through quality education, women empowerment, healthcare, and social development.",
  keywords: [
    "NGO in Gujarat",
    "Charitable Trust Rajkot",
    "Real Human Education & Charitable Trust",
    "Real Human Trust",
    "NGO Education India",
    "Donate for Education",
    "Volunteer NGO Rajkot",
    "Non-Profit Organization Gujarat",
    "80G Tax Exemption Donation",
    "Child Education NGO",
    "Social Welfare Trust"
  ],
  authors: [{ name: "Real Human Education & Charitable Trust" }],
  creator: "Real Human Education & Charitable Trust",
  publisher: "Real Human Education & Charitable Trust",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Real Human Education & Charitable Trust | Empowering Lives & Education",
    description: "Join us in bringing meaningful change through education, social welfare, healthcare, and community empowerment initiatives across Gujarat.",
    url: siteUrl,
    siteName: "Real Human Education & Charitable Trust",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Real Human Education & Charitable Trust Logo and Activities",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Human Education & Charitable Trust",
    description: "Empowering communities through education, healthcare, and social development in Rajkot, Gujarat.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport = {
  colorScheme: "light",
  themeColor: "#16307a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Real Human Education & Charitable Trust",
    "alternateName": "Real Human Trust",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Non-profit NGO in Rajkot, Gujarat focused on education, healthcare, women empowerment, and community development.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rajkot",
      "addressRegion": "Gujarat",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://facebook.com",
      "https://instagram.com",
      "https://linkedin.com"
    ]
  }

  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){for(var i of r)i.unregister()})}`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <ReduxProvider>
          <SplashScreen>
            {children}
          </SplashScreen>
          <Toaster position="top-center" richColors />
        </ReduxProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
