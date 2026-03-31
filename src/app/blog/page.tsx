'use client'

import Link from 'next/link'
import { AnimateOnScroll, Stagger } from '@/components/animate-on-scroll'
import { useI18n } from '@/lib/i18n'
import { blogPosts } from '@/lib/blog'

export default function BlogPage() {
  const { t } = useI18n()

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
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Stagger staggerMs={100} animation="fade-up">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40"
                >
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
                    <p className="mt-4 text-xs uppercase tracking-[0.15em] text-vermillion-dark group-hover:text-vermillion transition-colors">
                      {t('blog.readmore')}
                    </p>
                    <div className="mt-3 h-[1px] w-6 bg-vermillion/30 transition-all duration-500 group-hover:w-10 group-hover:bg-vermillion" />
                  </div>
                </Link>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  )
}
