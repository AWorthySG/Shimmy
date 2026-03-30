import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Press-On Nail Collections | Shimmy Singapore',
  description:
    'Browse and shop handcrafted press-on nail collections from Shimmyhands. Christmas Wishes, Yule Dreams, Sweater Weather, and more — each set made by hand in Singapore.',
  keywords: ['buy press on nails Singapore', 'nail collections Singapore', 'handmade nails online Singapore'],
  openGraph: {
    title: 'Shop Press-On Nail Collections | Shimmy Singapore',
    description: 'Shop handcrafted press-on nail collections — each set made by hand.',
    url: 'https://shimmybrows.vercel.app/nails/shop',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
