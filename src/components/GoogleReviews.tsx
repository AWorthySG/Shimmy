'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

interface Review {
  id?: string
  author_name: string
  rating: number
  text: string
  source?: string
  service_type?: string
}

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    author_name: 'Sarah L.',
    rating: 5,
    text: 'The nano brows look so natural! Abigail is incredibly skilled.',
    service_type: 'Nano Brows',
  },
  {
    author_name: 'Michelle T.',
    rating: 5,
    text: 'Best press-on nails I\'ve ever tried. The 3D designs are stunning.',
    service_type: 'Press-On Nails',
  },
  {
    author_name: 'Rachel K.',
    rating: 5,
    text: 'My ombre brows turned out perfect. The whole process was so comfortable.',
    service_type: 'Ombre Brows',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? 'text-gold' : 'text-warm-gray/30'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function GoogleReviews() {
  const { t } = useI18n()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
        } else {
          setReviews(PLACEHOLDER_REVIEWS)
        }
      })
      .catch(() => {
        setReviews(PLACEHOLDER_REVIEWS)
      })
  }, [])

  const displayReviews = reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS

  return (
    <section className="bg-cream py-16 sm:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">
            {t('reviews.tag')}
          </p>
          <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal md:text-4xl">
            {t('reviews.title')}
          </h2>
          {/* Google rating indicator */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-gold text-lg">★</span>
              ))}
            </div>
            <span className="text-sm text-charcoal-light">5.0</span>
            <span className="text-xs text-warm-gray">{t('reviews.on.google')}</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {displayReviews.slice(0, 3).map((review, i) => (
            <div
              key={review.id ?? i}
              className="border border-vermillion/15 bg-soft-white p-6 sm:p-8 hover:border-vermillion/30 transition-colors"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 text-sm italic leading-relaxed text-charcoal-light">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-5 border-t border-vermillion/15 pt-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.15em] text-vermillion-dark font-medium">
                  {review.author_name}
                </p>
                {review.service_type && (
                  <span className="text-[10px] uppercase tracking-[0.15em] text-vermillion-dark border border-vermillion/20 bg-vermillion/5 px-2 py-0.5">
                    {review.service_type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Link to Google reviews */}
        <div className="mt-8 text-center">
          <a
            href="https://g.page/shimmyhands/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors touch-target py-2"
          >
            {t('reviews.leave')} →
          </a>
        </div>
      </div>
    </section>
  )
}
