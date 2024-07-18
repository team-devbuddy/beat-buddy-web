'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClubProps } from '@/lib/types';

const Preview = ({ club }: ClubProps) => {
  const router = useRouter();

  return (
    <div className="relative flex h-[17.5rem] w-full flex-col justify-between">
      <div className="z-10 flex items-start justify-between px-[1rem] py-[1rem]">
        <button onClick={() => router.back()} aria-label="뒤로가기" className="text-white">
          <Image src="/icons/ArrowLeft.svg" alt="back icon" width={24} height={24} />
        </button>
        <div className="flex items-center space-x-[1.25rem]">
          <Image src="/icons/share.svg" alt="share icon" width={32} height={32} />
          <Image src="/icons/PinkHeart.svg" alt="heart icon" width={32} height={32} className="cursor-pointer" />
        </div>
      </div>
      <div
        className="absolute inset-0 z-0 bg-detail-gradient"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 37.5%, rgba(0, 0, 0, 0.72) 62.7%), url(${club.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
      <div className="z-20 flex flex-col items-start gap-[1rem] px-[1rem] py-[1.25rem] text-white">
        <h1 className="text-title-24-bold">{club.name}</h1>
        <div className="flex space-x-[0.5rem]">
          {club.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
