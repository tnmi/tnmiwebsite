import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import Chatbot from "@/components/Chatbot"

export const metadata = {
  title: "TrueNorth Materials - AI-Driven Materials Intelligence Platform",
  description: "Bridge the Valley of Death in materials innovation with our AI Cores. Accelerate R&D from TRL 4-7 to commercial success using big data and sensor intelligence in Canada.",
  generator: 'v0.dev',
  keywords: [
    'materials science',
    'AI platform',
    'TRL scale',
    'technology readiness level',
    'materials innovation',
    'critical minerals',
    'Canada innovation',
    'R&D acceleration',
    'valley of death',
    'sensor intelligence',
    'big data materials',
    'AI cores',
    'materials commercialization'
  ],
  authors: [{ name: 'TrueNorth Materials' }],
  creator: 'TrueNorth Materials',
  publisher: 'TrueNorth Materials',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://truenorthmaterials.com',
    title: 'TrueNorth Materials - AI-Driven Materials Intelligence Platform',
    description: 'Bridge the Valley of Death in materials innovation with our AI Cores. Accelerate R&D from TRL 4-7 to commercial success.',
    siteName: 'TrueNorth Materials',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TrueNorth Materials - AI-Driven Innovation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueNorth Materials - AI-Driven Materials Intelligence',
    description: 'Bridge the Valley of Death in materials innovation with our AI Cores.',
    images: ['/twitter-image.png'],
    creator: '@truenorthmaterials',
  },
  icons: {
    icon: [
      { url: '/favicon.png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: 'favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon', 
        url: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://truenorthmaterials.com" />
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
        
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TrueNorth Materials",
              "description": "AI-driven materials intelligence platform bridging the Valley of Death in innovation",
              "url": "https://truenorthmaterials.com",
              "logo": "https://truenorthmaterials.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "jason.deacon@truenorthmaterials.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Toronto",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "sameAs": [
                "https://www.linkedin.com/company/truenorth-material-innovations"
              ]
            })
          }}
        />
      </head>
      <body className="font-['Neue_Machina',system-ui,sans-serif] relative">
        <GoogleAnalytics />
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          {children}
          <div className="fixed bottom-4 right-4 z-[9999]">
          <Chatbot />  {/* Added the chatbot here */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}