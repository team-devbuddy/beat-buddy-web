import localFont from 'next/font/local';
import './globals.css';
import ClientOnlyLayout from './appLayout';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next'; // Viewport 타입을 import 합니다.
import Head from 'next/head';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

// 👇 viewport 객체를 생성하여 확대/축소 방지 설정을 추가합니다.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

// 👇 기존 metadata 객체에 다른 메타 태그 정보들을 추가합니다.
export const metadata: Metadata = {
  title: 'BeatBuddy',
  description: 'beatbuddy',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    images: ['https://www.beatbuddy.world/icons/thumbnail.svg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BeatBuddy',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} bg-[#f5f5f5]`}>
      <Head>
        <meta name="appleid-signin-client-id" content={process.env.NEXT_PUBLIC_APPLE_CLIENT_ID} />
        <meta name="appleid-signin-scope" content="name email" />
        <meta name="appleid-signin-redirect-uri" content={process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI} />
        <meta name="appleid-signin-state" content="origin:web" />
      </Head>

      <body className={`${pretendard.className}`}>
        <ClientOnlyLayout>{children}</ClientOnlyLayout>
        {/* Script 태그들은 body 내에 있어도 괜찮습니다. */}
        <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="beforeInteractive" />
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder,gl`}
          strategy="beforeInteractive"
        />
        <Script src="/MarkerClustering.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
