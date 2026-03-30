import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Eyebrow Embroidery Singapore | Shimmybrows',
  description:
    'Expert eyebrow embroidery in Singapore — nano brows, ombre powder brows, microblading, and brow shaping. Book your consultation with Shimmy today.',
  keywords: ['eyebrow embroidery Singapore', 'nano brows Singapore', 'ombre powder brows Singapore', 'brow shaping Singapore'],
  openGraph: {
    title: 'Eyebrow Embroidery Singapore | Shimmybrows',
    description: 'Expert brow artistry in Singapore. Nano brows, ombre powder brows, and more.',
    url: 'https://shimmyhands.com/brows',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function BrowsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
