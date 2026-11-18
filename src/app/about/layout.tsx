import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: { absolute: 'About Shimmy | Beauty Studio Singapore' },
  description:
    'Learn about Shimmy Beauty Studio — our story, philosophy, certifications, and the artistry behind Brows by Shimmyhands and Nails by Shimmyhands in Singapore.',
  openGraph: {
    title: 'About Shimmy | Beauty Studio Singapore',
    description: 'Our story, values, and the artistry behind Shimmy.',
    url: 'https://www.shimmyhands.com/about',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
