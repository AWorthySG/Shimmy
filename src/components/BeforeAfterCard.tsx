import Image from 'next/image'

interface BeforeAfterCardProps {
  before: string
  after: string
  label: string
}

export default function BeforeAfterCard({ before, after, label }: BeforeAfterCardProps) {
  return (
    <div className="border border-vermillion/15 bg-cream/50 overflow-hidden">
      <div className="flex gap-[2px]">
        <div className="flex-1 relative aspect-[4/5]">
          <Image src={before} alt={`Before — ${label}`} fill className="object-cover" sizes="(max-width: 768px) 45vw, 30vw" />
          <span className="absolute bottom-2 left-2 bg-charcoal/60 text-soft-white text-[10px] uppercase tracking-[0.15em] px-2 py-1">
            Before
          </span>
        </div>
        <div className="flex-1 relative aspect-[4/5]">
          <Image src={after} alt={`After — ${label}`} fill className="object-cover" sizes="(max-width: 768px) 45vw, 30vw" />
          <span className="absolute bottom-2 left-2 bg-charcoal/60 text-soft-white text-[10px] uppercase tracking-[0.15em] px-2 py-1">
            After
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-charcoal py-3">{label}</p>
    </div>
  )
}
