import { useState, useEffect } from 'react'

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    window.innerWidth < 768 ||
    ('ontouchstart' in window) ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  )
}

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice())
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export const MOBILE_BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const