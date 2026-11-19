import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/brows' },
  title: { absolute: 'Eyebrow embroidery Singapore | Brows by Shimmyhands' },
  description:
    'Eyebrow embroidery in Singapore: nano brows, ombre powder brows, microblading and brow shaping. Book a consultation with Shimmy.',
  keywords: ['eyebrow embroidery Singapore', 'nano brows Singapore', 'ombre powder brows Singapore', 'brow shaping Singapore'],
  openGraph: {
    title: 'Eyebrow embroidery Singapore | Brows by Shimmyhands',
    description: 'Brow embroidery in Singapore: nano brows, ombre powder brows and more.',
    url: 'https://www.shimmyhands.com/brows',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function BrowsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
