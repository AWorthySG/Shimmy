import type { Metadata } from 'next'
import { getAllTags } from '@/lib/blog'

type Props = {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `Articles tagged: ${decodedTag} | Shimmyhands`,
    description: `Browse all Shimmyhands articles tagged with "${decodedTag}" — expert tips on eyebrow embroidery, press-on nails, and more.`,
    openGraph: {
      title: `Articles tagged: ${decodedTag} | Shimmyhands`,
      description: `Browse all Shimmyhands articles tagged with "${decodedTag}".`,
      url: `https://shimmyhands.com/blog/tag/${tag}`,
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
