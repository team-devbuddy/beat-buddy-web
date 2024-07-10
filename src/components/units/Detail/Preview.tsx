"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClubProps } from '@/lib/types';

const Preview = ({ club }: ClubProps) => {
  return (
    <div className="relative w-full h-[17.5rem] flex flex-col justify-between">
      <div className="flex items-start justify-between px-[1rem] py-[1rem] z-10">
        <Link href="/" className="text-white">
          <Image src="/icons/ArrowLeft.svg" alt="back icon" width={24} height={24} />
        </Link>
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
        }}
      ></div>
      <div className="flex flex-col items-start gap-[1rem] px-[1rem] py-[1.25rem] text-white z-20 ">
        <h1 className="text-title-24-bold">{club.name}</h1>
        <div className="flex space-x-[0.5rem] ">
          {club.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
