'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type OverlayId = 'exit-intent' | 'spin-wheel' | 'search' | 'stories' | 'size-guide' | 'cart' | 'mobile-nav' | null

const OverlayContext = createContext<{
  activeOverlay: OverlayId
  openOverlay: (id: OverlayId) => void
  closeOverlay: () => void
  isOpen: (id: OverlayId) => boolean
}>({ activeOverlay: null, openOverlay: () => {}, closeOverlay: () => {}, isOpen: () => false })

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayId>(null)
  const openOverlay = useCallback((id: OverlayId) => setActiveOverlay(id), [])
  const closeOverlay = useCallback(() => setActiveOverlay(null), [])
  const isOpen = useCallback((id: OverlayId) => activeOverlay === id, [activeOverlay])
  return (
    <OverlayContext.Provider value={{ activeOverlay, openOverlay, closeOverlay, isOpen }}>
      {children}
    </OverlayContext.Provider>
  )
}

export const useOverlay = () => useContext(OverlayContext)
