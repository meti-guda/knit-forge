export const colors = {
  background: {
    primary: '#F5EDE0',
    secondary: '#EDE5D8',
    dark: '#2C2A28',
    alt: '#E8DFD1',
  },
  primary: {
    DEFAULT: '#B85C38',
    dark: '#8B3A2F',
    light: '#D4714A',
  },
  accent: {
    gold: '#D4A853',
    goldLight: '#E5C078',
    moss: '#5C6B4A',
    mossLight: '#7A8A6A',
    plum: '#7B5D7A',
    plumLight: '#9A7D99',
  },
  text: {
    primary: '#1A1916',
    secondary: '#6B6560',
    muted: '#9A9590',
    inverse: '#F5EDE0',
  },
  border: {
    DEFAULT: '#D9CFC0',
    light: '#E8DFD1',
    dark: '#C4B8A8',
  },
  state: {
    success: '#5C6B4A',
    error: '#B85C38',
    warning: '#D4A853',
  },
  overlay: {
    dark: 'rgba(44, 42, 40, 0.8)',
    light: 'rgba(245, 237, 224, 0.9)',
  },
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #B85C38 0%, #8B3A2F 100%)',
  warm: 'linear-gradient(135deg, #F5EDE0 0%, #EDE5D8 100%)',
  gold: 'linear-gradient(135deg, #D4A853 0%, #E5C078 100%)',
  dark: 'linear-gradient(180deg, #2C2A28 0%, #1A1916 100%)',
  sunset: 'linear-gradient(135deg, #B85C38 0%, #D4A853 50%, #7B5D7A 100%)',
  moss: 'linear-gradient(135deg, #5C6B4A 0%, #7A8A6A 100%)',
} as const;

export const typography = {
  fontFamily: {
    display: ['var(--font-playfair)', 'serif'],
    body: ['var(--font-lora)', 'serif'],
    heading: ['var(--font-dm-serif)', 'serif'],
    mono: ['var(--font-space-mono)', 'monospace'],
    decorative: ['var(--font-sacramento)', 'cursive'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(26, 25, 22, 0.05)',
  DEFAULT: '0 2px 4px 0 rgba(26, 25, 22, 0.08)',
  md: '0 4px 6px -1px rgba(26, 25, 22, 0.1), 0 2px 4px -1px rgba(26, 25, 22, 0.06)',
  lg: '0 10px 15px -3px rgba(26, 25, 22, 0.1), 0 4px 6px -2px rgba(26, 25, 22, 0.05)',
  xl: '0 20px 25px -5px rgba(26, 25, 22, 0.1), 0 10px 10px -5px rgba(26, 25, 22, 0.04)',
  '2xl': '0 25px 50px -12px rgba(26, 25, 22, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(26, 25, 22, 0.06)',
  stitched: '0 2px 0 0 #D9CFC0, 0 4px 8px -2px rgba(26, 25, 22, 0.1)',
} as const;

export const transitions = {
  DEFAULT: 'all 0.2s ease-in-out',
  slow: 'all 0.4s ease-in-out',
  fast: 'all 0.1s ease-in-out',
  spring: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounce: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: '0',
  dropdown: '10',
  sticky: '20',
  fixed: '30',
  modalBackdrop: '40',
  modal: '50',
  popover: '60',
  tooltip: '70',
} as const;

export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
} as const;

export type Theme = typeof theme;
