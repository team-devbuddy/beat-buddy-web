// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import ClientOnlyLayout from './appLayout';

const inter = Inter({ subsets: ['latin'] });

const pretendard = localFont({
  src: '../lib/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata = {
  title: 'BeatBuddy',
  description: 'beatbuddy',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} bg-[#f5f5f5]`}>
      <head>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
      </head>
      <body className={`${pretendard.className}`}>
        <ClientOnlyLayout>{children}</ClientOnlyLayout>
      </body>
    </html>
  );
}
