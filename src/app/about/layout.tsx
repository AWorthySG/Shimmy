import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: { absolute: 'About Shimmy | Beauty Studio Singapore' },
  description:
    'About Shimmy Beauty Studio in Singapore: our story, philosophy and certifications, and the work behind Brows by Shimmyhands and Nails by Shimmyhands.',
  openGraph: {
    title: 'About Shimmy | Beauty Studio Singapore',
    description: 'Our story, our values and the work behind Shimmy.',
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
