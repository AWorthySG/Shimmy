import type { Metadata } from 'next'
import { getAllTags } from '@/lib/blog'

type Props = {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  return {
    alternates: { canonical: `/blog/tag/${tag}` },
    title: `Articles tagged: ${decodedTag}`,
    description: `All Shimmyhands articles tagged "${decodedTag}": tips on eyebrow embroidery, press-on nails and more.`,
    openGraph: {
      title: `Articles tagged: ${decodedTag} | Shimmyhands`,
      description: `All Shimmyhands articles tagged "${decodedTag}".`,
      url: `https://www.shimmyhands.com/blog/tag/${tag}`,
      siteName: 'Shimmy',
      locale: 'en_SG',
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
