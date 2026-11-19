import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/gift-cards' },
  title: { absolute: 'Gift cards | Shimmy Beauty Studio Singapore' },
  description:
    'Buy a Shimmy Beauty Studio gift card for someone\'s brows. Choose S$25, S$50 or S$100. It can be used on all brow services.',
  keywords: ['gift card', 'eyebrow embroidery gift', 'beauty gift card Singapore', 'Shimmy Beauty Studio'],
  openGraph: {
    title: 'Gift cards | Shimmy Beauty Studio Singapore',
    description: 'Shimmy gift cards for brow services, from S$25.',
    url: 'https://www.shimmyhands.com/gift-cards',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
