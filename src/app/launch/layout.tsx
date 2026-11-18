import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/launch' },
  title: { absolute: 'Coming Soon | Shimmy' },
  robots: { index: false, follow: false },
}

export default function LaunchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
