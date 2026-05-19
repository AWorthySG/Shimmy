import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What to Expect | Your Brow Appointment',
  description:
    'A step-by-step walkthrough of your brow appointment at Shimmy — from consultation and design to the procedure, reveal, and aftercare briefing.',
  openGraph: {
    title: 'What to Expect | Your Brow Appointment',
    description: 'Step-by-step guide to your brow appointment at Shimmy Singapore.',
    url: 'https://shimmyhands.com/brows/process',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
