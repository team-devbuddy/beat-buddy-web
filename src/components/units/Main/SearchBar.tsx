// components/SearchBar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchBar() {
  return (
    <div className="flex w-full items-center justify-between bg-main px-4 py-3">
      <Link href="/search" className="block w-full">
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-black bg-transparent px-2 py-2 text-BG-black placeholder:text-BG-black focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            readOnly
          />
          <Image
            src="/icons/red-search.svg"
            alt="search icon"
            width={20}
            height={20}
            className="absolute bottom-3 right-[1rem]"
          />
        </div>
      </Link>
    </div>
  );
}
