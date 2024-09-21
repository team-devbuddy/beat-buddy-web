import localFont from 'next/font/local';
import './globals.css';
import ClientOnlyLayout from './appLayout';
import Script from 'next/script';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
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
        <meta property="og:image" content="https://www.beatbuddy.world/icons/thumbnail.svg" />
      </head>
      <body className={`${pretendard.className}`}>
        <ClientOnlyLayout>{children}</ClientOnlyLayout>
        <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
