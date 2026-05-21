import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refer a Friend | Shimmy Beauty Studio Singapore',
  description:
    'Share your referral link with friends and you both get $10 off your next Shimmy Beauty Studio session. Brow embroidery, nano brows, ombre powder brows in Singapore.',
  keywords: ['referral program', 'eyebrow embroidery Singapore', 'Shimmy Beauty Studio referral'],
  openGraph: {
    title: 'Refer a Friend | Shimmy Beauty Studio Singapore',
    description: 'Share your referral link — you both get $10 off your next session.',
    url: 'https://shimmyhands.com/referral',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
