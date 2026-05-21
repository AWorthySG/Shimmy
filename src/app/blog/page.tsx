'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimateOnScroll, Stagger } from '@/components/animate-on-scroll'
import { useI18n } from '@/lib/i18n'
import { blogPosts } from '@/lib/blog'

export default function BlogPage() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'brows' | 'nails'>('all')

  // Extract all unique tags from blog posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const post of blogPosts) {
      for (const tag of post.tags) {
        tagSet.add(tag)
      }
    }
    return Array.from(tagSet).sort()
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Filter posts by search query, selected tags, and category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false

      // Search filter
      if (query.trim()) {
        const title = t(post.titleKey).toLowerCase()
        if (!title.includes(query.toLowerCase())) return false
      }

      // Tag filter (OR logic)
      if (selectedTags.length > 0) {
        if (!selectedTags.some((tag) => post.tags.includes(tag))) return false
      }

      return true
    })
  }, [query, selectedTags, selectedCategory, t])

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t('blog.tag')}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            {t('blog.title')}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-charcoal-light">
            {t('blog.desc')}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 my-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-xs">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* Article Grid */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Search Input */}
          <div className="relative mb-6">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('blog.search.placeholder')}
              className="w-full border border-vermillion/15 bg-cream/50 py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-warm-gray/60 focus:border-vermillion/40 focus:outline-none"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {(['all', 'brows', 'nails'] as const).map((cat) => {
              const labelKey = cat === 'all' ? 'blog.filter.all' : cat === 'brows' ? 'blog.filter.brows' : 'blog.filter.nails'
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors duration-200 ${
                    selectedCategory === cat
                      ? 'bg-vermillion text-soft-white border-vermillion'
                      : 'bg-cream/50 text-charcoal-light border-vermillion/15 hover:border-vermillion/40'
                  }`}
                >
                  {t(labelKey)}
                </button>
              )
            })}
          </div>

          {/* Tag Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] border transition-colors duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-vermillion text-soft-white border-vermillion'
                    : 'bg-cream/50 text-charcoal-light border-vermillion/15 hover:border-vermillion/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Posts Grid or Empty State */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-warm-gray text-sm">{t('blog.no.results')}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Stagger staggerMs={100} animation="fade-up">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40"
                  >
                    {/* Hero image */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={post.image}
                        alt={t(post.titleKey)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Category badge + read time */}
                    <div className="px-5 sm:px-6 pt-5 sm:pt-6 flex items-center justify-between">
                      <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 border ${
                        post.category === 'brows'
                          ? 'text-vermillion-dark border-vermillion/20 bg-vermillion/5'
                          : 'text-jade border-jade/20 bg-jade/5'
                      }`}>
                        {t(post.categoryKey)}
                      </span>
                      <span className="text-[10px] text-warm-gray">
                        {post.readTime} {t('blog.readtime')}
                      </span>
                    </div>

                    {/* Title + description */}
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4">
                      <h2 className="font-serif text-lg sm:text-xl text-charcoal group-hover:text-vermillion transition-colors duration-300">
                        {t(post.titleKey)}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal-light line-clamp-3">
                        {t(post.descKey)}
                      </p>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 bg-charcoal/5 text-warm-gray"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-vermillion-dark group-hover:text-vermillion transition-colors">
                        {t('blog.readmore')}
                      </p>
                      <div className="mt-3 h-[1px] w-6 bg-vermillion/30 transition-all duration-500 group-hover:w-10 group-hover:bg-vermillion" />
                    </div>
                  </Link>
                ))}
              </Stagger>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
