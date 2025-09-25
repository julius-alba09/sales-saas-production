/**
 * Optimized Design Tokens
 * Minimal, performance-focused design system
 */

// Core colors only (remove unused shades)
export const colors = {
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  secondary: '#f3f4f6',
  accent: '#06b6d4',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#111827',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  background: '#ffffff',
  backgroundMuted: '#f9fafb',
} as const;

// Essential spacing scale
export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
} as const;

// Typography essentials
export const text = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
} as const;

// Responsive breakpoints
export const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// Common component styles
export const components = {
  card: 'bg-white rounded-lg shadow-md border border-gray-100',
  cardHighlighted: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg',
  cardBordered: 'bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200',
  button: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
  buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
  buttonSecondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  section: 'mb-16',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  checkIcon: 'w-5 h-5 text-green-500 mt-1 flex-shrink-0',
} as const;