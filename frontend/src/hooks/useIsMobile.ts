"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the device is a true mobile/touch device.
 * Used to switch between click-to-toggle (desktop) and press-and-hold (mobile) UX.
 * 
 * IMPORTANT: Many modern laptops have touch capability (trackpads, touchscreens),
 * so we must be strict about mobile detection to avoid breaking desktop UX.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Primary check: user agent for actual mobile devices
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Secondary check: small screen AND touch (but user agent takes priority)
      const isSmallScreen = window.innerWidth <= 768;
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Only consider mobile if:
      // 1. User agent explicitly indicates mobile device, OR
      // 2. Small screen with touch AND no mouse pointer (true mobile)
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasNoFinePointer = !window.matchMedia('(pointer: fine)').matches;
      
      // Mobile = explicit mobile UA, or (small + touch + coarse pointer only)
      setIsMobile(mobileUserAgent || (isSmallScreen && hasTouchScreen && hasCoarsePointer && hasNoFinePointer));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default useIsMobile;
