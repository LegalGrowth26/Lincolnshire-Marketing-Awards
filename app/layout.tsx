import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lincolnshire Marketing Awards 2026',
    template: '%s | Lincolnshire Marketing Awards 2026',
  },
  description:
    'Recognising exceptional business growth across Lincolnshire. Free to enter, independently judged, black-tie awards dinner — September 2026.',
  keywords: [
    'Lincolnshire Marketing Awards',
    'business awards Lincolnshire',
    'SME awards',
    'business growth award',
    'Lincolnshire business',
    'LMA 2026',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Lincolnshire Marketing Awards 2026',
    title: 'Lincolnshire Marketing Awards 2026',
    description:
      'Recognising exceptional business growth across Lincolnshire. Free to enter, independently judged, black-tie awards dinner — September 2026.',
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
      </head>
      <body className="font-poppins bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  )
}
