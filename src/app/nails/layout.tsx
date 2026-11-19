import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/nails' },
  title: { absolute: 'Handcrafted press-on nails Singapore | Shimmyhands' },
  description:
    'Handcrafted press-on nails in Singapore by Shimmyhands. Shop collections with 3D nail art, cat-eye effects and hand-painted designs.',
  keywords: ['press on nails Singapore', 'handcrafted nails Singapore', '3D nail art Singapore', 'Shimmyhands'],
  openGraph: {
    title: 'Handcrafted press-on nails Singapore | Shimmyhands',
    description: 'Press-on nails, every set made by hand in Singapore.',
    url: 'https://www.shimmyhands.com/nails',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function NailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
