import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loyalty Program | Shimmy Beauty Studio Singapore',
  description:
    'Check your loyalty status at Shimmy Beauty Studio. Every 3 visits earns a reward — S$15 off, S$30 off, or a free touch-up.',
  keywords: ['loyalty program', 'beauty rewards Singapore', 'Shimmy Beauty Studio loyalty'],
  openGraph: {
    title: 'Loyalty Program | Shimmy Beauty Studio Singapore',
    description: 'Every 3 visits earns a reward. Check your loyalty status at Shimmy.',
    url: 'https://shimmyhands.com/loyalty',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
