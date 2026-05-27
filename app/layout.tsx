import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://lincolnshiremarketingawards.co.uk'),
  title: {
    default: 'Lincolnshire Marketing Awards 2026',
    template: '%s | Lincolnshire Marketing Awards 2026',
  },
  description:
    'Recognising exceptional business growth across Lincolnshire. Free to enter, independently judged, black-tie awards dinner. September 2026.',
  keywords: [
    'Lincolnshire Marketing Awards',
    'business awards Lincolnshire',
    'SME awards',
    'business growth award',
    'Lincolnshire business',
    'LMA 2026',
  ],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon',        type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Lincolnshire Marketing Awards 2026',
    title: 'Lincolnshire Marketing Awards 2026',
    description:
      'Recognising exceptional business growth across Lincolnshire. Free to enter, independently judged, black-tie awards dinner. September 2026.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lincolnshire Marketing Awards 2026',
    description: 'Recognising exceptional business growth across Lincolnshire.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Event',
                  name: 'Lincolnshire Marketing Awards 2026',
                  description:
                    'Recognising exceptional marketing and business growth across Lincolnshire. Free to enter, independently judged, black-tie awards dinner. September 2026.',
                  startDate: '2026-09',
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                  location: {
                    '@type': 'Place',
                    name: 'Lincolnshire',
                    address: {
                      '@type': 'PostalAddress',
                      addressRegion: 'Lincolnshire',
                      addressCountry: 'GB',
                    },
                  },
                  image: 'https://lincolnshiremarketingawards.co.uk/opengraph-image',
                  url: 'https://lincolnshiremarketingawards.co.uk',
                  organizer: {
                    '@type': 'Organization',
                    name: 'Lincolnshire Marketing Awards',
                    url: 'https://lincolnshiremarketingawards.co.uk',
                  },
                  isAccessibleForFree: true,
                  typicalAgeRange: '18-',
                },
                {
                  '@type': 'Organization',
                  name: 'Lincolnshire Marketing Awards',
                  url: 'https://lincolnshiremarketingawards.co.uk',
                  logo: 'https://lincolnshiremarketingawards.co.uk/favicon.svg',
                  description:
                    'Annual marketing awards recognising exceptional business growth across Lincolnshire.',
                  areaServed: {
                    '@type': 'AdministrativeArea',
                    name: 'Lincolnshire',
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'hello@legalgrowth.co.uk',
                    contactType: 'customer service',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-poppins bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  )
}
