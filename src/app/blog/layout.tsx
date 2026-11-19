import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: { absolute: 'Care tips and guides | Shimmyhands', template: '%s | Shimmyhands' },
  description:
    'Tips on eyebrow embroidery aftercare, applying press-on nails, choosing a brow shape and more, from Shimmyhands Beauty Studio in Singapore.',
  keywords: ['eyebrow embroidery aftercare', 'how to apply press on nails', 'nano brows vs microblading', 'brow care Singapore'],
  openGraph: {
    title: 'Care tips and guides | Shimmyhands',
    description: 'Beauty tips and aftercare guides from Shimmyhands.',
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
