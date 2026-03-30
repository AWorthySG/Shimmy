export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&~footer]:hidden">
      {children}
    </div>
  )
}
