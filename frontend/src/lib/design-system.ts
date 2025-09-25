/**
 * Design System Constants
 * Centralized design tokens for consistent styling across the application
 */

// Color System
export const colors = {
  primary: {
    50: 'rgb(238, 242, 255)',
    100: 'rgb(224, 231, 255)', 
    500: 'rgb(99, 102, 241)',
    600: 'rgb(79, 70, 229)',
    700: 'rgb(67, 56, 202)',
  },
  secondary: {
    50: 'rgb(250, 245, 255)',
    100: 'rgb(243, 232, 255)',
    500: 'rgb(147, 51, 234)',
    600: 'rgb(126, 34, 206)',
    700: 'rgb(109, 40, 217)',
  },
  accent: {
    50: 'rgb(236, 254, 255)',
    100: 'rgb(207, 250, 254)',
    500: 'rgb(6, 182, 212)',
    600: 'rgb(8, 145, 178)',
    700: 'rgb(14, 116, 144)',
  },
  neutral: {
    0: 'rgb(255, 255, 255)',
    50: 'rgb(248, 250, 252)',
    100: 'rgb(241, 245, 249)',
    200: 'rgb(226, 232, 240)',
    300: 'rgb(203, 213, 225)',
    400: 'rgb(148, 163, 184)',
    500: 'rgb(100, 116, 139)',
    600: 'rgb(71, 85, 105)',
    700: 'rgb(51, 65, 85)',
    800: 'rgb(30, 41, 59)',
    900: 'rgb(15, 23, 42)',
    950: 'rgb(2, 6, 23)',
  },
  semantic: {
    success: {
      50: 'rgb(240, 253, 244)',
      500: 'rgb(34, 197, 94)',
      600: 'rgb(22, 163, 74)',
    },
    warning: {
      50: 'rgb(255, 251, 235)',
      500: 'rgb(245, 158, 11)',
      600: 'rgb(217, 119, 6)',
    },
    error: {
      50: 'rgb(254, 242, 242)',
      500: 'rgb(239, 68, 68)',
      600: 'rgb(220, 38, 38)',
    },
  }
} as const

// Typography System
export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const

// Spacing System (consistent with Tailwind's 4px base scale)
export const spacing = {
  0: '0px',
  1: '4px',    // 0.25rem
  2: '8px',    // 0.5rem
  3: '12px',   // 0.75rem
  4: '16px',   // 1rem
  5: '20px',   // 1.25rem
  6: '24px',   // 1.5rem
  8: '32px',   // 2rem
  10: '40px',  // 2.5rem
  12: '48px',  // 3rem
  16: '64px',  // 4rem
  20: '80px',  // 5rem
  24: '96px',  // 6rem
  32: '128px', // 8rem
  40: '160px', // 10rem
  48: '192px', // 12rem
} as const

// Border Radius System
export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const

// Animation & Transition System
export const animation = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Breakpoint System (Mobile-first)
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Component-specific Design Tokens
export const components = {
  button: {
    padding: {
      sm: '8px 12px',
      base: '10px 16px', 
      lg: '12px 20px',
      xl: '16px 24px',
    },
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    transition: `all ${animation.duration.base} ${animation.easing.smooth}`,
  },
  card: {
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    shadow: shadows.base,
    border: `1px solid ${colors.neutral[200]}`,
    backgroundColor: colors.neutral[0],
  },
  input: {
    padding: '10px 12px',
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[300]}`,
    fontSize: typography.fontSize.sm[0],
    transition: `all ${animation.duration.base} ${animation.easing.smooth}`,
  },
  section: {
    paddingY: spacing[16],
    paddingX: spacing[6],
    maxWidth: '1280px',
    margin: '0 auto',
  },
} as const

// Utility Functions
export const utils = {
  // Convert hex to RGB
  hexToRgb: (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return ''
    
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    
    return `rgb(${r}, ${g}, ${b})`
  },
  
  // Generate gradient classes
  gradient: (from: string, to: string): string => 
    `bg-gradient-to-r from-${from} to-${to}`,
    
  // Responsive breakpoint helper
  responsive: (breakpoint: keyof typeof breakpoints) => 
    `@media (min-width: ${breakpoints[breakpoint]})`,
    
  // Focus ring utility
  focusRing: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors.primary[500]}`,
}