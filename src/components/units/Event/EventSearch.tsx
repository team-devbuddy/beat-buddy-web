'use client';

import Image from 'next/image';


export default function EventSearch() {
  return (
    <div className="flex justify-between items-center py-[0.75rem] px-[1.25rem]">
        <p className="text-subtitle-20-bold text-white">EVENT</p>
      <Image src="/icons/search-white.svg" alt="search" width={16.8} height={16.8} />
    </div>
  );
}
