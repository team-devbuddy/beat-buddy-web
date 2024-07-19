import React from 'react';
import Image from 'next/image';

export default function TrendBar() {
  return (
    <div className="flex w-full items-center justify-between bg-main px-[1rem] pb-[1rem] pt-[0.5rem]">
      <div className="flex items-center space-x-2">
        <Image src="/icons/Rank_num.svg" alt="Rank_num icon" width={20} height={20} />
        <span className="font-medium text-black">Awesome</span>
      </div>
    </div>
  );
}
