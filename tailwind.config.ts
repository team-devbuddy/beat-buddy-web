import type { Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      poppins: ['poppins', 'sans-serif'],
      queensides: ['Queensides'],
      suit: ['SUIT', 'sans-serif'],
      paperlogy: ['Paperlogy-7Bold', 'sans-serif'],
      pretendard: ['Pretendard', 'sans-serif'],
      sans: ['var(--font-pretendard)', 'sans-serif'],
    },
    extend: {
      scrollbarHide: {
        'scrollbar-width': 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
      minHeight: {
        '100vh': '100vh',
        'webkit-fill-available': '-webkit-fill-available',
      },
      screens: {
        sm: '440px',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'club-gradient': 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.72) 92.65%)',
        'detail-gradient':
          'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 37.5%, rgba(0, 0, 0, 0.72) 62.7%), var(--club-image) lightgray 50% / cover no-repeat',
      },
      colors: {
        'BG-black': '#17181C',
        main: '#EE1171',
        main2: '#FF4493',
        sub2: '#480522',
        sub1: '#8F0B48',
        gray100: '#C3C5C9',
        gray200: '#979A9F',
        gray300: '#7C7F83',
        gray400: '#4B4D4F',
        gray500: '#313335',
        gray600: '#2F3237',
        gray700: '#28292A',
        FooterBlack: '#000000',
      },
      borderRadius: {
        md: '0.5rem',
        sm: '0.25rem',
        xs: '0.13rem',
      },
      fontSize: {
        'subtitle-20-medium': [
          '20px',
          {
            fontWeight: '500',
            lineHeight: '150%',
          },
        ],
        'subtitle-20-bold': [
          '20px',
          {
            fontWeight: '700',
            lineHeight: '150%',
            letterSpacing: '-0.025rem',
          },
        ],
        'title-32': [
          '32px',
          {
            fontWeight: '700',
            lineHeight: '150%',
          },
        ],
        'title-24-bold': [
          '24px',
          {
            lineHeight: '150%',
            fontWeight: '700',
          },
        ],
        'title-24-medium': [
          '24px',
          {
            lineHeight: '150%',
            fontWeight: '500',
          },
        ],
        'title-20-bold': [
          '20px',
          {
            lineHeight: '150%',
            fontWeight: '700',
          },
        ],
        'title-20-medium': [
          '20px',
          {
            lineHeight: '150%',
            fontWeight: '500',
          },
        ],
        'button-bold': [
          '1.0625rem',
          {
            fontWeight: '600',
            lineHeight: '145%',
            letterSpacing: '-0.02656rem',
          },
        ],
        'body1-16-bold': [
          '16px',
          {
            lineHeight: '160%',
            fontWeight: '700',
          },
        ],
        'body1-16-medium': [
          '16px',
          {
            lineHeight: '160%',
            fontWeight: '500',
          },
        ],
        'body2-15-bold': [
          '15px',
          {
            lineHeight: '150%',
            fontWeight: '700',
          },
        ],
        'body2-15-medium': [
          '15px',
          {
            lineHeight: '150%',
            fontWeight: '500',
            letterSpacing: '-0.015rem',
          },
        ],
        'body3-12-bold': [
          '12px',
          {
            lineHeight: '160%',
            fontWeight: '700',
          },
        ],
        'body3-12-medium': [
          '12px',
          {
            lineHeight: '160%',
            fontWeight: '500',
            letterSpacing: '-0.015rem',
          },
        ],
        'now-hot': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            fontWeight: '500',
            letterSpacing: '-0.025rem',
          },
        ],
        'main-queen': [
          '1.375rem',
          {
            lineHeight: '2.0625rem',
            fontWeight: '500',
            letterSpacing: '-0.0275rem',
          },
        ],
        'navigate-queen': [
          '0.6875rem',
          {
            lineHeight: '160%', // 1.1rem
            fontWeight: '700', // bold
            letterSpacing: '-0.01375rem', // letter spacing
          },
        ],

        // 이미지에 맞는 새로운 스타일들
        'subtitle-22-bold': [
          '22px',
          {
            fontWeight: '700',
            lineHeight: '140%',
            letterSpacing: '-2%',
          },
        ],
        'subtitle-22-medium': [
          '22px',
          {
            fontWeight: '500',
            lineHeight: '140%',
            letterSpacing: '-2%',
          },
        ],
        'body-15-medium': [
          '15px',
          {
            fontWeight: '500',
            lineHeight: '150%',
            letterSpacing: '-0.01875rem',
          },
        ],
        'body-15-bold': [
          '15px',
          {
            fontWeight: '700',
            lineHeight: '150%',
            letterSpacing: '-0.01875rem',
          },
        ],
        'body-14-bold': [
          '14px',
          {
            fontWeight: '700',
            lineHeight: '150%',
            letterSpacing: '-0.0175rem',
          },
        ],
        'body-14-medium': [
          '14px',
          {
            fontWeight: '500',
            lineHeight: '150%',
            letterSpacing: '-0.0175rem',
          },
        ],
        'body-13-bold': [
          '13px',
          {
            fontWeight: '700',
            lineHeight: '150%',
            letterSpacing: '-0.01625rem',
          },
        ],
        'body-13-medium': [
          '13px',
          {
            fontWeight: '500',
            lineHeight: '150%',
          },
        ],
        'body-12-medium': [
          '12px',
          {
            fontWeight: '500',
            lineHeight: '150%',
            letterSpacing: '-0.015rem',
          },
        ],
        'body-11-medium': [
          '11px',
          {
            fontWeight: '500',
            lineHeight: '150%',
          },
        ],
        'body-10-medium': [
          '10px',
          {
            fontWeight: '500',
            lineHeight: '160%',
            letterSpacing: '-0.0125rem',
          },
        ],
        'calendar-date': [
          '0.97513rem',
          {
            fontWeight: '500',
            lineHeight: '155%',
            letterSpacing: '-0.02438rem',
          },
        ],
        'calendar-day-bold': [
          '1rem',
          {
            fontWeight: '600',
            lineHeight: '145%',
            letterSpacing: '-0.025rem',
          },
        ],
        'button-16-semibold': [
          '1rem',
          {
            fontWeight: '600',
            lineHeight: '135%',
            letterSpacing: '-0.02rem',
          },
        ],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        '.custom-club-card': {
          display: 'flex',
          width: '20rem',
          height: '22.5rem',
          padding: '1.5rem 1.5rem 1.75rem 1.75rem',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: '2.5rem',
          flexShrink: '0',
        },
        '.bg-main-active': {
          background: 'var(--main-active, rgba(238, 17, 113, 0.20))',
        },
        '.text-ellipsis': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        '.hide-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Safari 전용 유틸리티
        '.safari-icon-fix': {
          '-webkit-transform': 'translateZ(0)',
          transform: 'translateZ(0)',
          '-webkit-backface-visibility': 'hidden',
          'backface-visibility': 'hidden',
          '-webkit-font-smoothing': 'antialiased',
          'image-rendering': 'auto',
        },
        '.safari-padding-fix': {
          'padding-top': 'max(1rem, env(safe-area-inset-top))',
          'padding-bottom': 'max(1rem, env(safe-area-inset-bottom))',
        },
        '.safari-input-fix': {
          '-webkit-appearance': 'none',
          appearance: 'none',
          'border-radius': '0',
          '-webkit-border-radius': '0',
          'background-clip': 'padding-box',
          'transform-origin': 'center',
          zoom: '1',
        },
      });
    },
  ],
};

export default config;
