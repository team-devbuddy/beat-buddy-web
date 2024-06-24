import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BeatBuddy',
  description: 'beatbuddy',
  icons: {
    icon: '/logo.png',
  },
};
const pretendard = localFont({
  src: '../lib/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <html lang="ko" className={`${pretendard.variable}`}>
        <body className={`${pretendard.className} `}>
          {/* Full Container */}
          <div className="flex h-full w-full items-center justify-center">
            {/* Mobile Container */}
            <div className="flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
              {/* Content */}
              <div className="flex">{children}</div>
              {/* <Footer /> */}
            </div>
          </div>
        </body>
      </html>
    </html>
  );
}
