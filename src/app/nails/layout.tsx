import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Handcrafted Press-On Nails Singapore | Shimmyhands',
  description:
    'Handcrafted press-on nails in Singapore by Shimmyhands. Shop unique collections featuring 3D nail art, cat-eye effects, and hand-painted designs.',
  keywords: ['press on nails Singapore', 'handcrafted nails Singapore', '3D nail art Singapore', 'Shimmyhands'],
  openGraph: {
    title: 'Handcrafted Press-On Nails Singapore | Shimmyhands',
    description: 'Handcrafted press-on nails — every set made by hand in Singapore.',
    url: 'https://shimmybrows.vercel.app/nails',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function NailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
