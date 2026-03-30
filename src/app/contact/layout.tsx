import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book or Enquire | Shimmy Beauty Studio Singapore',
  description:
    'Book a brow consultation or enquire about press-on nails. Contact Shimmy Beauty Studio via WhatsApp or Instagram. View our studio hours and location in Singapore.',
  keywords: ['book eyebrow embroidery Singapore', 'beauty studio contact Singapore'],
  openGraph: {
    title: 'Book or Enquire | Shimmy Beauty Studio Singapore',
    description: 'Get in touch with Shimmy Beauty Studio — WhatsApp, Instagram, or visit us.',
    url: 'https://shimmybrows.vercel.app/contact',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
