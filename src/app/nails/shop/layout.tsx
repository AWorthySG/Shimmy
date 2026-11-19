import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/nails/shop' },
  title: { absolute: 'Shop press-on nail collections | Shimmy Singapore', template: '%s | Shimmyhands' },
  description:
    'Shop handcrafted press-on nail collections from Shimmyhands: Christmas Wishes, Yule Dreams, Sweater Weather and more, each set made by hand in Singapore.',
  keywords: ['buy press on nails Singapore', 'nail collections Singapore', 'handmade nails online Singapore'],
  openGraph: {
    title: 'Shop press-on nail collections | Shimmy Singapore',
    description: 'Shop our press-on nail collections. We make every set by hand.',
    url: 'https://www.shimmyhands.com/nails/shop',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',

    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
