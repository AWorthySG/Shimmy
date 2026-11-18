import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/links' },
  title: { absolute: 'Links | Shimmy Beauty Studio Singapore' },
  description: 'Quick links to book brow appointments, shop press-on nails, and contact Shimmy Beauty Studio Singapore.',
}

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
