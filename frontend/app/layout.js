import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { SplashScreen } from "@/components/splash-screen/splash-screen"
import { ReduxProvider } from "@/redux/Provider"
import "./globals.css"

export const metadata = {
  title: {
    default: "Real Human Education & Charitable Trust",
    template: "%s | Real Human Trust",
  },
  description:
    "Real Human Education & Charitable Trust — a Rajkot, Gujarat based NGO working for education, empowerment and community upliftment. Join, donate, or volunteer today.",
  keywords: [
    "NGO",
    "charitable trust",
    "education",
    "Rajkot",
    "Gujarat",
    "donate",
    "volunteer",
    "Real Human Trust",
  ],
  generator: "v0.app",
}

export const viewport = {
  colorScheme: "light",
  themeColor: "#16307a",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ReduxProvider>
          {/* <SplashScreen> */}
          {children}
          {/* </SplashScreen> */}
          <Toaster position="top-center" richColors />
        </ReduxProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
