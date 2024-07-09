import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';

interface ClubsListProps {
  clubs: Club[];
}

function ClubList({ clubs }: ClubsListProps) {
  return (
    <div className="flex flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1.19rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
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
                <div className="club-gradient absolute inset-0"></div>
                <div className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={32} height={32} />
                </div>
              </div>
              <div className="mt-[1rem]">
                <h3 className="text-ellipsis text-body1-16-bold text-white">{venue.name}</h3>
                <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
                  {venue.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-[0.25rem] text-gray300">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                  <span className="text-body3-12-medium">{venue.likes}</span>
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
