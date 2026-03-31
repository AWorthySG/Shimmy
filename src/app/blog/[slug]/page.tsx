'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AnimateOnScroll } from '@/components/animate-on-scroll'
import { useI18n } from '@/lib/i18n'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog'

export default function BlogArticlePage() {
  const { t } = useI18n()
  const params = useParams<{ slug: string }>()
  const post = getPostBySlug(params.slug)

  if (!post) {
    return (
      <section className="bg-soft-white py-20 px-4 text-center">
        <p className="text-warm-gray">Article not found.</p>
        <Link href="/blog" className="mt-4 inline-block text-sm text-vermillion-dark underline-grow">
          {t('blog.back')}
        </Link>
      </section>
    )
  }

  const related = getRelatedPosts(post)

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-block text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6"
          >
            {t('blog.back')}
          </Link>

          <div className="flex items-center gap-3 mb-4">
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

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal tracking-wide leading-tight">
            {t(post.titleKey)}
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-charcoal-light">
            {t(post.descKey)}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center justify-center gap-3 my-6">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
        <span className="text-vermillion/40 text-xs">✦</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
      </div>

      {/* Article Content */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-5 sm:space-y-6">
          {post.contentKeys.map((key, i) => (
            <AnimateOnScroll key={key} animation="fade-up" delay={i * 60}>
              <p className="text-sm sm:text-base leading-relaxed text-charcoal-light">
                {t(key)}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-10 sm:py-14 px-4 sm:px-6 text-center">
        <p className="text-sm text-charcoal-light">
          {t('blog.cta')}
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/6589308973"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-magnetic glow-pulse w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vermillion px-6 sm:px-8 py-3 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
          >
            {t('cta.whatsapp')}
          </a>
          <Link
            href="/contact"
            className="text-sm uppercase tracking-[0.15em] text-vermillion-dark transition-colors hover:text-vermillion touch-target py-2"
          >
            {t('nav.contact')} →
          </Link>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-soft-white py-10 sm:py-14 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-8">
              <div className="mx-auto h-[2px] w-[40px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-3" />
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal">
                {t('blog.related')}
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group border border-vermillion/15 bg-cream/50 p-5 hover:border-vermillion/40 transition-all duration-300 shine-on-hover"
                >
                  <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border ${
                    rel.category === 'brows'
                      ? 'text-vermillion-dark border-vermillion/20'
                      : 'text-jade border-jade/20'
                  }`}>
                    {t(rel.categoryKey)}
                  </span>
                  <h4 className="mt-3 font-serif text-base text-charcoal group-hover:text-vermillion transition-colors">
                    {t(rel.titleKey)}
                  </h4>
                  <p className="mt-2 text-xs text-charcoal-light line-clamp-2">
                    {t(rel.descKey)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: t(post.titleKey),
            description: t(post.descKey),
            author: { '@type': 'Organization', name: 'Shimmyhands' },
            publisher: { '@type': 'Organization', name: 'Shimmyhands' },
          }),
        }}
      />
    </>
  )
}
