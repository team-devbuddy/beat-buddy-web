import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clubs } from '@/lib/data';

export default function HotVenues() {
  return (
    <div className="flex flex-col mt-[1.5rem]">
      <div className="flex flex-col items-start justify-between px-[1rem] py-[0.5rem]">
        <span className="text-main2 font-queensides text-lg">Hot</span>
        <span className="text-gray200 text-body2-15-medium">실시간으로 인기있는 베뉴 정보입니다.</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-[1.19rem] gap-y-[2.5rem] mx-[1rem] my-[1.5rem]">
        {clubs.map((venue) => (
          <Link key={venue.id} href={`/detail/${venue.id}`} passHref>
            <div className="relative flex flex-col">
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <Image
                  src={venue.imageUrl}
                  alt={`${venue.name} image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-sm"
                />
                <div className="absolute inset-0 club-gradient"></div>
                <div className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer">
                  <Image
                    src="/icons/PinkHeart.svg"
                    alt="pink-heart icon"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <div className="mt-[1rem]">
                <h3 className="text-white text-body1-16-bold text-ellipsis">{venue.name}</h3>
                <div className="flex flex-wrap gap-[0.5rem] mt-[0.75rem] mb-[1.06rem]">
                  {venue.tags.map((tag, index) => (
                    <span key={index} className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center space-x-[0.25rem] text-gray300">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                  <span className='text-body3-12-medium'>{venue.likes}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
