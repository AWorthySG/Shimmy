import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: { absolute: 'Care Tips & Guides | Shimmyhands', template: '%s | Shimmyhands' },
  description:
    'Expert tips on eyebrow embroidery aftercare, press-on nail application, brow shape guides, and more from Shimmyhands Beauty Studio Singapore.',
  keywords: ['eyebrow embroidery aftercare', 'how to apply press on nails', 'nano brows vs microblading', 'brow care Singapore'],
  openGraph: {
    title: 'Care Tips & Guides | Shimmyhands',
    description: 'Expert beauty tips and aftercare guides from Shimmyhands.',
    url: 'https://www.shimmyhands.com/blog',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
