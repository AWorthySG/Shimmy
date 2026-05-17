interface BeforeAfterCardProps {
  before: string
  after: string
  label: string
}

function PlaceholderSlot({ tag }: { tag: string }) {
  return (
    <div className="flex-1 relative aspect-[4/5] bg-gradient-to-br from-cream-dark/60 via-cream to-vermillion/5 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
        <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
          {tag} Photo
        </p>
        <div className="mx-auto w-10 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
      </div>
      <span className="absolute bottom-2 left-2 bg-charcoal/60 text-soft-white text-[10px] uppercase tracking-[0.15em] px-2 py-1">
        {tag}
      </span>
    </div>
  )
}

export default function BeforeAfterCard({ label }: BeforeAfterCardProps) {
  // TODO: Replace placeholders with real before/after photos using next/image:
  // <Image src={before} alt={`Before — ${label}`} fill className="object-cover" />
  return (
    <div className="border border-vermillion/15 bg-cream/50 overflow-hidden">
      <div className="flex gap-[2px]">
        <PlaceholderSlot tag="Before" />
        <PlaceholderSlot tag="After" />
      </div>
      <p className="text-center text-sm text-charcoal py-3">{label}</p>
    </div>
  )
}
