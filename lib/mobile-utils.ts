import { useState, useEffect } from 'react'

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false

  // Check for actual mobile devices first (most reliable)
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return true
  }

  // Only consider small screens as mobile if they also have touch AND are likely mobile
  // This prevents desktop browsers from being detected as mobile just because they're narrow
  const hasTouch = 'ontouchstart' in window
  const isSmallScreen = window.innerWidth < 768
  const isVerySmallScreen = window.innerWidth < 480 // Definitely mobile size

  // If very small screen, definitely mobile
  if (isVerySmallScreen) return true

  // If small screen AND touch, likely mobile (but not definitive for tablets/hybrids)
  if (isSmallScreen && hasTouch) return true

  // Otherwise, assume desktop
  return false
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