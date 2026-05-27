import type { Metadata } from 'next'
import './globals.css'

const SITE_TITLE = 'Mission Business 2026 — Free business & defence event, Grantham'
const SITE_DESCRIPTION =
  'Mission Business returns for its second year. A free, practical event for Lincolnshire and East Midlands business leaders. Defence insight, practical speakers, regional connections. 8 July 2026, Prince William of Gloucester Barracks, Grantham.'

export const metadata: Metadata = {
  metadataBase: new URL('https://lincolnshiremarketingawards.co.uk'),
  title: {
    default: SITE_TITLE,
    template: '%s | Mission Business 2026',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Mission Business',
    'Mission Business 2026',
    'Lincolnshire business event',
    'East Midlands business event',
    'defence business',
    'business networking Lincolnshire',
    'Grantham business event',
    'Prince William of Gloucester Barracks',
    'Paul Green',
    'Business Unfinished',
    'free business event',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon',        type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Mission Business 2026',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#050505" />
      </head>
      <body>{children}</body>
    </html>
  )
}
