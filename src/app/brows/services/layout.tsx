import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/brows/services' },
  title: { absolute: 'Brow Services & Pricing | Shimmy Singapore' },
  description:
    'Brow services at Shimmy Beauty Studio: eyebrow embroidery, nano brows, ombre powder brows, microblading and lip blush, with prices and durations.',
  keywords: ['brow services Singapore', 'eyebrow embroidery price Singapore', 'nano brows cost', 'ombre powder brows price'],
  openGraph: {
    title: 'Brow Services & Pricing | Shimmy Singapore',
    description: 'View our full menu of brow services with pricing.',
    url: 'https://www.shimmyhands.com/brows/services',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
