'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function EventHeader() {
  return (
    <div className="flex justify-between items-center py-[0.75rem] px-[1.25rem]">
      <p className="text-subtitle-20-bold text-white">EVENT</p>
      <Link href="/event/search">
        <Image src="/icons/search-white.svg" alt="search" width={16.8} height={16.8} />
      </Link>
    </div>
  );
}
