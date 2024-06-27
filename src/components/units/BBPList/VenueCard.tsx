import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClubProps } from '@/lib/types';


const VenueCard = ({ club }: ClubProps) => {
  return (
    <div className="relative flex flex-col">
      <Link href={`/detail/${club.id}`}>
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <Image
            src={club.imageUrl}
            alt={`${club.name} image`}
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
      </Link>
      <div className="mt-[1rem]">
        <h3 className="text-white text-body1-16-bold text-ellipsis">{club.name}</h3>
        <div className="flex flex-wrap gap-[0.5rem] mt-[0.75rem] mb-[1.06rem]">
          {club.tags.map((tag, index) => (
            <span key={index} className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{tag}</span>
          ))}
        </div>
        <div className="flex items-center space-x-[0.25rem] text-gray300">
          <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
          <span className='text-body3-12-medium'>{club.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
