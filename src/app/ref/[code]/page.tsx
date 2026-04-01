'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReferralRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = use(params)
  const router = useRouter()

  useEffect(() => {
    async function trackAndRedirect() {
      // Track the referral click
      try {
        await fetch(`/api/referral?code=${encodeURIComponent(code)}`)
      } catch {
        // Non-critical — redirect anyway
      }

      // Set referral cookie (expires in 30 days)
      document.cookie = `shimmy_ref=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`

      // Redirect to homepage
      router.replace('/')
    }

    trackAndRedirect()
  }, [code, router])

  return (
    <section className="flex min-h-[50vh] items-center justify-center bg-cream px-4 text-center">
      <div>
        <p className="text-sm text-charcoal-light">Redirecting&hellip;</p>
      </div>
    </section>
  )
}
