import React from 'react';
import Image from 'next/image';
import { Club } from '@/lib/types';

interface VenueCardProps {
  club: Club;
}

function VenueCard({ club }: VenueCardProps) {
  return (
    <div key={club.id} className="relative flex flex-col">
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <Image
          src={club.imageUrl}
          alt={`${club.name} image`}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        <div className="absolute inset-0 club-gradient"></div>
        <div className="absolute top-[1.5rem] right-[1.5rem] cursor-pointer z-10">
          <Image src="/icons/GrayHeart.svg" alt="gray-heart icon" width={32} height={32} />
        </div>
      </div>
      <div className="mt-[1rem]">
        <h3 className="text-title-20-bold">{club.name}</h3>
        <div className="flex space-x-2 mt-[0.75rem] mb-[1.06rem]">
          <span className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{club.location}</span>
          <span className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{club.genre1}</span>
          <span className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{club.genre2}</span>
        </div>
        <div className="flex items-center space-x-[0.25rem] text-gray300">
          <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20} />
          <span className="text-body3-12-medium ml-[0.25rem]">{club.likes}</span>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;
