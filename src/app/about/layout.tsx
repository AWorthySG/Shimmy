import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Shimmy | Beauty Studio Singapore',
  description:
    'Learn about Shimmy Beauty Studio — our story, philosophy, certifications, and the artistry behind Shimmybrows and Shimmyhands in Singapore.',
  openGraph: {
    title: 'About Shimmy | Beauty Studio Singapore',
    description: 'Our story, values, and the artistry behind Shimmy.',
    url: 'https://shimmybrows.vercel.app/about',
    siteName: 'Shimmy',
    locale: 'en_SG',
    type: 'website',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
