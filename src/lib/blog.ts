export interface BlogPost {
  slug: string
  titleKey: string
  descKey: string
  category: 'brows' | 'nails'
  categoryKey: string
  readTime: number // minutes
  contentKeys: string[] // array of paragraph i18n keys
  relatedSlugs: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'eyebrow-embroidery-aftercare-guide',
    titleKey: 'blog.1.title',
    descKey: 'blog.1.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 4,
    contentKeys: ['blog.1.p1', 'blog.1.p2', 'blog.1.p3', 'blog.1.p4', 'blog.1.p5', 'blog.1.p6'],
    relatedSlugs: ['how-to-choose-brow-shape', 'nano-brows-vs-microblading'],
  },
  {
    slug: 'how-to-apply-press-on-nails',
    titleKey: 'blog.2.title',
    descKey: 'blog.2.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 3,
    contentKeys: ['blog.2.p1', 'blog.2.p2', 'blog.2.p3', 'blog.2.p4', 'blog.2.p5'],
    relatedSlugs: ['how-to-remove-press-on-nails', 'how-to-choose-nail-size'],
  },
  {
    slug: 'nano-brows-vs-microblading',
    titleKey: 'blog.3.title',
    descKey: 'blog.3.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.3.p1', 'blog.3.p2', 'blog.3.p3', 'blog.3.p4', 'blog.3.p5'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'how-to-choose-brow-shape'],
  },
  {
    slug: 'how-to-remove-press-on-nails',
    titleKey: 'blog.4.title',
    descKey: 'blog.4.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 3,
    contentKeys: ['blog.4.p1', 'blog.4.p2', 'blog.4.p3', 'blog.4.p4'],
    relatedSlugs: ['how-to-apply-press-on-nails', 'how-to-choose-nail-size'],
  },
  {
    slug: 'how-to-choose-brow-shape',
    titleKey: 'blog.5.title',
    descKey: 'blog.5.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 4,
    contentKeys: ['blog.5.p1', 'blog.5.p2', 'blog.5.p3', 'blog.5.p4', 'blog.5.p5'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'nano-brows-vs-microblading'],
  },
  {
    slug: 'how-to-choose-nail-size',
    titleKey: 'blog.6.title',
    descKey: 'blog.6.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 3,
    contentKeys: ['blog.6.p1', 'blog.6.p2', 'blog.6.p3', 'blog.6.p4'],
    relatedSlugs: ['how-to-apply-press-on-nails', 'how-to-remove-press-on-nails'],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPost => !!p)
}
