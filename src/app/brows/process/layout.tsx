import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/brows/process' },
  title: 'What to expect | Your brow appointment',
  description:
    'A step-by-step guide to your brow appointment at Shimmy: consultation, design, the procedure, the reveal and your aftercare briefing.',
  openGraph: {
    title: 'What to expect | Your brow appointment',
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
