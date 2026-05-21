import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Cards | Shimmy Beauty Studio Singapore',
  description:
    'Give the gift of beautiful brows. Purchase a Shimmy Beauty Studio gift card — available in S$25, S$50, and S$100. Redeemable for all brow services.',
  keywords: ['gift card', 'eyebrow embroidery gift', 'beauty gift card Singapore', 'Shimmy Beauty Studio'],
  openGraph: {
    title: 'Gift Cards | Shimmy Beauty Studio Singapore',
    description: 'Give the gift of beautiful brows — Shimmy gift cards from S$25.',
    url: 'https://shimmyhands.com/gift-cards',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
