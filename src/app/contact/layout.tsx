import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/contact' },
  title: { absolute: 'Book or enquire | Shimmy Beauty Studio Singapore' },
  description:
    'Book a brow consultation or ask about press-on nails. Reach Shimmy Beauty Studio on WhatsApp or Instagram, and see our studio hours in Singapore.',
  keywords: ['book eyebrow embroidery Singapore', 'beauty studio contact Singapore'],
  openGraph: {
    title: 'Book or enquire | Shimmy Beauty Studio Singapore',
    description: 'Message Shimmy Beauty Studio on WhatsApp or Instagram, or visit us.',
    url: 'https://www.shimmyhands.com/contact',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
