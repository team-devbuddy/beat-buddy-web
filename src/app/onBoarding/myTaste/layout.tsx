'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Children } from 'react';

export default function OnBoardingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define conditions based on the URL path
  const genrePage = pathname === '/onBoarding/myTaste/genre';
  const moodPage = pathname === '/onBoarding/myTaste/mood';
  const locationPage = pathname === '/onBoarding/myTaste/location';

  return (
    <section className="w-full">
      <nav className="w-full">
        {genrePage && (
          <>
            <div className="flex items-center justify-between p-4">
              <Link href="/onBoarding">
                <Image src="/icons/backward.svg" alt="logo" width={24} height={24} />
              </Link>
              <Link href="/">
                <Image src="/images/onBoarding/onBoarding1.png" alt="logo" width={50} height={10} />
              </Link>
            </div>
            {children}
          </>
        )}

        {moodPage && (
          <>
            <div className="flex items-center justify-between p-4">
              <Link href="/onBoarding/myTaste/genre">
                <Image src="/icons/backward.svg" alt="logo" width={24} height={24} />
              </Link>
              <Link href="/">
                <Image src="/images/onBoarding/onBoarding2.png" alt="logo" width={50} height={10} />
              </Link>
            </div>
            {children}
          </>
        )}

        {locationPage && (
          <>
            <div className="flex items-center justify-between p-4">
              <Link href="/onBoarding">
                <Image src="/icons/backward.svg" alt="logo" width={24} height={24} />
              </Link>
              <Link href="/">
                <Image src="/images/onBoarding/onBoarding3.png" alt="logo" width={50} height={10} />
              </Link>
            </div>
            {children}
          </>
        )}
      </nav>
    </section>
  );
}
