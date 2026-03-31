import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Care Tips & Guides | Shimmyhands',
  description:
    'Expert tips on eyebrow embroidery aftercare, press-on nail application, brow shape guides, and more from Shimmyhands Beauty Studio Singapore.',
  keywords: ['eyebrow embroidery aftercare', 'how to apply press on nails', 'nano brows vs microblading', 'brow care Singapore'],
  openGraph: {
    title: 'Care Tips & Guides | Shimmyhands',
    description: 'Expert beauty tips and aftercare guides from Shimmyhands.',
    url: 'https://shimmyhands.com/blog',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
