import React from 'react';
import Image from 'next/image';

export default function SearchBar() {
  return (
    <div className="flex w-full bg-main items-center justify-between px-4 py-3">
      <div className="relative w-full">
        <input
          className="w-full border-b-2 border-black bg-transparent px-2 py-2 text-BG-black placeholder:text-BG-black focus:outline-none"
          placeholder="지금 가장 인기있는 클럽은?"
        />
        <Image src="/icons/search.svg" alt="search icon" width={24} height={24} className="absolute bottom-3 right-0" />
      </div>
    </div>
  );
}
