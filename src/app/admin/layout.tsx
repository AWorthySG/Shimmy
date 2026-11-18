import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/admin' },
  title: { absolute: 'Admin | Shimmy' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
