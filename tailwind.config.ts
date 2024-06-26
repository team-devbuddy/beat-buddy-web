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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
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
      },
      borderRadius: {
        md: '0.5rem',
      },
      fontSize: {
        'body2': ['0.9375rem', {
          lineHeight: '1.40625rem',
          letterSpacing: '-0.01875rem',
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
      });
    },
  ],
};
export default config;
