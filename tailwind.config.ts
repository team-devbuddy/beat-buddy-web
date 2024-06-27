import type { Config } from 'tailwindcss';
import { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        queensides: ['Queensides', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'club-gradient': "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.72) 92.65%)",
        'detail-gradient': 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 37.5%, rgba(0, 0, 0, 0.72) 62.7%), var(--club-image) lightgray 50% / cover no-repeat',

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
        gray700: '#28292A',
        FooterBlack: "#000000"
      },
      borderRadius: {
        md: '0.5rem',
        sm: '0.25rem',
        xs: '0.13rem',
      },
      fontSize: {
        'title-32': ['32px', {
          lineHeight: '150%',
          fontWeight: '700',
        }],
        'title-24-bold': ['24px', {
          lineHeight: '150%',
          fontWeight: '700',
        }],
        'title-24-medium': ['24px', {
          lineHeight: '150%',
          fontWeight: '500',
        }],
        'title-20-bold': ['20px', {
          lineHeight: '150%',
          fontWeight: '700',
        }],
        'title-20-medium': ['20px', {
          lineHeight: '150%',
          fontWeight: '500',
        }],
        'button-bold': ['18px', {
          lineHeight: '150%',
          fontWeight: '700',
        }],
        'body1-16-bold': ['16px', {
          lineHeight: '160%',
          fontWeight: '700',
        }],
        'body1-16-medium': ['16px', {
          lineHeight: '160%',
          fontWeight: '500',
        }],
        'body2-15-bold': ['15px', {
          lineHeight: '150%',
          fontWeight: '700',
        }],
        'body2-15-medium': ['15px', {
          lineHeight: '150%',
          fontWeight: '500',
        }],
        'body3-12-bold': ['12px', {
          lineHeight: '160%',
          fontWeight: '700',
        }],
        'body3-12-medium': ['12px', {
          lineHeight: '160%',
          fontWeight: '500',
        }],
      },
    },
  },
  plugins: [    
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
        
      });
    },
  ],
};

export default config;
