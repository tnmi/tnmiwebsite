'use client'

import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {

    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      {/* SECURITY NOTE: Using dangerouslySetInnerHTML here is safe because:
          1. GA_TRACKING_ID comes from environment variable (controlled by us)
          2. Script content is static Google Analytics initialization code
          3. No user input is involved in this script generation */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}