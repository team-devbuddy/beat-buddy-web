'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function EventHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <p className="text-subtitle-20-bold text-white">EVENT</p>
      <Link href="/event/search">
        <Image src="/icons/search-white.svg" alt="search" width={16.8} height={16.8} />
      </Link>
    </div>
  );
}
