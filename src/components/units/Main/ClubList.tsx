// ClubList.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { HotChartProps } from '@/lib/types';

interface ClubsListProps {
  clubs: HotChartProps[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

function ClubList({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: ClubsListProps) {
  return (
    <div className="flex flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1.19rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
        {clubs.map((venue) => (
          <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
            <div className="relative flex h-full flex-col">
              <div className="relative w-full pb-[100%]">
                <Image
                  src={'/images/DefaultImage.png'}
                  alt={`${venue.koreanName} image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-sm"
                />
                <div className="club-gradient absolute inset-0"></div>
                <div
                  className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                  onClick={(e) => handleHeartClickWrapper(e, venue.venueId)}>
                  <Image
                    src={likedClubs[venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                    alt="pink-heart icon"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <div className="mt-[1rem] flex flex-grow flex-col justify-between">
                <div>
                  <h3 className="text-ellipsis text-body1-16-bold text-white">{venue.englishName}</h3>
                  <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
                    {venue.tagList?.length > 0 ? (
                      venue.tagList.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                        No Tags
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center space-x-[0.25rem] text-gray300">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                    <span className="text-body3-12-medium">
                      {heartbeatNums[venue.venueId] !== undefined ? heartbeatNums[venue.venueId] : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ClubList;
