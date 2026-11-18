import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/brows/process' },
  title: 'What to Expect | Your Brow Appointment',
  description:
    'A step-by-step walkthrough of your brow appointment at Shimmy — from consultation and design to the procedure, reveal, and aftercare briefing.',
  openGraph: {
    title: 'What to Expect | Your Brow Appointment',
    description: 'Step-by-step guide to your brow appointment at Shimmy Singapore.',
    url: 'https://www.shimmyhands.com/brows/process',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
