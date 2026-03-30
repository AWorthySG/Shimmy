import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brow Services & Pricing | Shimmy Singapore',
  description:
    'Full menu of brow services at Shimmy Beauty Studio — eyebrow embroidery, nano brows, ombre powder brows, microblading, and lip blush. View pricing, durations, and what each service includes.',
  keywords: ['brow services Singapore', 'eyebrow embroidery price Singapore', 'nano brows cost', 'ombre powder brows price'],
  openGraph: {
    title: 'Brow Services & Pricing | Shimmy Singapore',
    description: 'View our full menu of brow services with pricing.',
    url: 'https://shimmyhands.com/brows/services',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
