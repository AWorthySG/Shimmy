export interface BlogPost {
  slug: string
  titleKey: string
  descKey: string
  category: 'brows' | 'nails'
  categoryKey: string
  readTime: number // minutes
  contentKeys: string[] // array of paragraph i18n keys
  relatedSlugs: string[]
  image: string
  tags: string[]
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
    image: '/images/testimonials/hui-ling-portrait.jpg',
    tags: ['aftercare', 'embroidery', 'first-time'],
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
    image: '/images/nails/sweater-flatlay-1.jpg',
    tags: ['press-on-nails', 'nail-care', 'first-time'],
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
    image: '/images/testimonials/priya-portrait.jpg',
    tags: ['nano-brows', 'microblading', 'comparison', 'skin-types'],
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
    image: '/images/nails/ingenue-lifestyle.jpg',
    tags: ['press-on-nails', 'nail-care'],
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
    image: '/images/testimonials/nurul-portrait.jpg',
    tags: ['brow-shapes', 'first-time', 'embroidery'],
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
    image: '/images/nails/lovers-flatlay-5.jpg',
    tags: ['press-on-nails', 'nail-care', 'first-time'],
  },
  {
    slug: 'lip-blush-what-to-expect',
    titleKey: 'blog.7.title',
    descKey: 'blog.7.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.7.p1', 'blog.7.p2', 'blog.7.p3', 'blog.7.p4', 'blog.7.p5', 'blog.7.p6'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'first-eyebrow-embroidery-appointment'],
    image: '/images/testimonials/priya-portrait.jpg',
    tags: ['lip-blush', 'aftercare', 'first-time'],
  },
  {
    slug: 'first-eyebrow-embroidery-appointment',
    titleKey: 'blog.8.title',
    descKey: 'blog.8.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.8.p1', 'blog.8.p2', 'blog.8.p3', 'blog.8.p4', 'blog.8.p5', 'blog.8.p6'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'how-to-choose-brow-shape'],
    image: '/images/testimonials/hui-ling-portrait.jpg',
    tags: ['embroidery', 'first-time', 'aftercare'],
  },
  {
    slug: 'brow-embroidery-during-pregnancy',
    titleKey: 'blog.9.title',
    descKey: 'blog.9.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 4,
    contentKeys: ['blog.9.p1', 'blog.9.p2', 'blog.9.p3', 'blog.9.p4', 'blog.9.p5'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'nano-brows-vs-microblading'],
    image: '/images/testimonials/nurul-portrait.jpg',
    tags: ['embroidery', 'aftercare', 'skin-types'],
  },
  {
    slug: 'press-on-nails-vs-gel-manicure',
    titleKey: 'blog.10.title',
    descKey: 'blog.10.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 5,
    contentKeys: ['blog.10.p1', 'blog.10.p2', 'blog.10.p3', 'blog.10.p4', 'blog.10.p5', 'blog.10.p6'],
    relatedSlugs: ['how-to-apply-press-on-nails', 'make-press-on-nails-last-longer'],
    image: '/images/nails/ingenue-1.jpg',
    tags: ['press-on-nails', 'nail-care', 'comparison'],
  },
  {
    slug: 'make-press-on-nails-last-longer',
    titleKey: 'blog.11.title',
    descKey: 'blog.11.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 4,
    contentKeys: ['blog.11.p1', 'blog.11.p2', 'blog.11.p3', 'blog.11.p4', 'blog.11.p5'],
    relatedSlugs: ['how-to-apply-press-on-nails', 'how-to-remove-press-on-nails'],
    image: '/images/nails/sweater-flatlay-1.jpg',
    tags: ['press-on-nails', 'nail-care', 'aftercare'],
  },
  {
    slug: 'best-nail-designs-singapore-weather',
    titleKey: 'blog.12.title',
    descKey: 'blog.12.desc',
    category: 'nails',
    categoryKey: 'blog.cat.nails',
    readTime: 4,
    contentKeys: ['blog.12.p1', 'blog.12.p2', 'blog.12.p3', 'blog.12.p4', 'blog.12.p5'],
    relatedSlugs: ['make-press-on-nails-last-longer', 'how-to-choose-nail-size'],
    image: '/images/nails/lovers-flatlay-5.jpg',
    tags: ['press-on-nails', 'nail-care'],
  },
  {
    slug: 'ombre-vs-microblading-fading',
    titleKey: 'blog.13.title',
    descKey: 'blog.13.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.13.p1', 'blog.13.p2', 'blog.13.p3', 'blog.13.p4', 'blog.13.p5', 'blog.13.p6'],
    relatedSlugs: ['nano-brows-vs-microblading', 'how-to-choose-brow-shape'],
    image: '/images/testimonials/hui-ling-portrait.jpg',
    tags: ['ombre', 'microblading', 'comparison'],
  },
  {
    slug: 'choose-embroidery-nano-ombre',
    titleKey: 'blog.14.title',
    descKey: 'blog.14.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.14.p1', 'blog.14.p2', 'blog.14.p3', 'blog.14.p4', 'blog.14.p5', 'blog.14.p6'],
    relatedSlugs: ['ombre-vs-microblading-fading', 'skin-type-affects-brow-results'],
    image: '/images/testimonials/priya-portrait.jpg',
    tags: ['embroidery', 'nano-brows', 'ombre', 'comparison'],
  },
  {
    slug: 'eyebrow-embroidery-touch-up',
    titleKey: 'blog.15.title',
    descKey: 'blog.15.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 4,
    contentKeys: ['blog.15.p1', 'blog.15.p2', 'blog.15.p3', 'blog.15.p4', 'blog.15.p5', 'blog.15.p6'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'first-eyebrow-embroidery-appointment'],
    image: '/images/testimonials/nurul-portrait.jpg',
    tags: ['touch-up', 'embroidery', 'aftercare'],
  },
  {
    slug: 'makeup-over-semi-permanent-brows',
    titleKey: 'blog.16.title',
    descKey: 'blog.16.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 4,
    contentKeys: ['blog.16.p1', 'blog.16.p2', 'blog.16.p3', 'blog.16.p4', 'blog.16.p5'],
    relatedSlugs: ['eyebrow-embroidery-aftercare-guide', 'eyebrow-embroidery-touch-up'],
    image: '/images/testimonials/hui-ling-portrait.jpg',
    tags: ['aftercare', 'embroidery', 'microblading'],
  },
  {
    slug: 'eyebrow-embroidery-for-men',
    titleKey: 'blog.17.title',
    descKey: 'blog.17.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.17.p1', 'blog.17.p2', 'blog.17.p3', 'blog.17.p4', 'blog.17.p5', 'blog.17.p6'],
    relatedSlugs: ['first-eyebrow-embroidery-appointment', 'how-to-choose-brow-shape'],
    image: '/images/testimonials/priya-portrait.jpg',
    tags: ['embroidery', 'brow-shapes', 'first-time'],
  },
  {
    slug: 'skin-type-affects-brow-results',
    titleKey: 'blog.18.title',
    descKey: 'blog.18.desc',
    category: 'brows',
    categoryKey: 'blog.cat.brows',
    readTime: 5,
    contentKeys: ['blog.18.p1', 'blog.18.p2', 'blog.18.p3', 'blog.18.p4', 'blog.18.p5', 'blog.18.p6'],
    relatedSlugs: ['choose-embroidery-nano-ombre', 'nano-brows-vs-microblading'],
    image: '/images/testimonials/nurul-portrait.jpg',
    tags: ['skin-types', 'embroidery', 'nano-brows', 'ombre'],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((p) => p.tags.includes(tag))
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  for (const post of blogPosts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((s) => blogPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPost => !!p)
}
