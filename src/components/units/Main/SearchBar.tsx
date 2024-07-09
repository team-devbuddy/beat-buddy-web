'use client'
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar({ isInputMode = false }) {
  return (
    <div className="flex w-full items-center justify-between bg-main px-4 py-3">
      {isInputMode ? (
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-black bg-transparent px-2 py-2 text-BG-black placeholder:text-BG-black focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
          />
          <Image
            src="/icons/search.svg"
            alt="search icon"
            width={24}
            height={24}
            className="absolute bottom-3 right-0 cursor-pointer"
            onClick={() => { alert('검색 기능 구현 필요'); }}
          />
        </div>
      ) : (
        <Link href="/search" className="block w-full">
          <div className="relative w-full">
            <input
              className="w-full border-b-2 border-black bg-transparent px-2 py-2 text-BG-black placeholder:text-BG-black focus:outline-none"
              placeholder="지금 가장 인기있는 클럽은?"
              readOnly
            />
            <Image
              src="/icons/search.svg"
              alt="search icon"
              width={24}
              height={24}
              className="absolute bottom-3 right-0"
            />
          </div>
        </Link>
      )}
    </div>
  );
}
