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

  // Define a list of special pages
  const specialPages = ['/onBoarding'];

  // Define a list of pages that should only render children
  const childrenOnlyPages = ['/onBoarding/myTaste/genre', '/onBoarding/myTaste/mood', '/onBoarding/myTaste/location'];

  // Check if the current pathname is in the list of special pages
  const isSpecialPage = specialPages.includes(pathname);

  // Check if the current pathname is in the list of children-only pages
  const isChildrenOnlyPage = childrenOnlyPages.includes(pathname);

  if (isChildrenOnlyPage) {
    return <>{children}</>;
  }

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
