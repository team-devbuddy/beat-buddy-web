'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function OnBoardingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define a condition based on the URL path
  const isSpecialPage = pathname === '/onBoarding';

  return (
    <section className="w-full">
      {isSpecialPage ? (
        <nav className="flex w-full justify-end p-4">
          <Link href="/">
            <p className="cursor-pointer px-3 py-[0.38rem] text-xs font-bold text-gray200">나중에 하기</p>
          </Link>
        </nav>
      ) : (
        <nav className="w-full p-4">
          <Image src="/icons/backward.svg" alt="logo" width={24} height={24} className="cursor-pointer" />
        </nav>
      )}
      {children}
    </section>
  );
}
