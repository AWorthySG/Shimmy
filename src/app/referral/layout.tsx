import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/referral' },
  title: { absolute: 'Refer a Friend | Shimmy Beauty Studio Singapore' },
  description:
    'Share your referral link and you and your friend both get S$10 off your next session at Shimmy Beauty Studio, Singapore.',
  keywords: ['referral program', 'eyebrow embroidery Singapore', 'Shimmy Beauty Studio referral'],
  openGraph: {
    title: 'Refer a Friend | Shimmy Beauty Studio Singapore',
    description: 'Share your referral link — you both get S$10 off your next session.',
    url: 'https://www.shimmyhands.com/referral',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
