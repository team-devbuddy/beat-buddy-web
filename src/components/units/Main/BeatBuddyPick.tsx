import React from 'react';
import Image from 'next/image';
import { clubs } from '@/lib/data';

export default function BeatBuddyPick() {
  return (
    <div className="flex flex-col mt-[0.44rem]">
      <div className="flex items-center justify-between px-[1rem] py-[1.25rem]">
        <span className="text-main2 font-Queensides text-[1.5rem]">BeatBuddy Pick</span>
        <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
      </div>
      <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory space-x-[0.5rem] px-[1rem]">
        {clubs.map((club) => (
          <div key={club.id} className="relative custom-club-card min-w-[15rem] mt-[0.5rem] rounded-md overflow-hidden snap-center">
            <Image src={club.imageUrl} alt={`${club.name} image`} layout="fill" className="object-cover" />
            <div className="absolute top-[1.5rem] right-[1.5rem]  cursor-pointer">
              <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={32} height={32} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex space-x-[0.75rem] mb-[0.75rem]">
                <span className="bg-gray500 text-gray100 text-xs px-[0.38rem] py-[0.13rem] rounded">{club.location}</span>
                <span className="bg-gray500 text-gray100 text-xs px-[0.38rem] py-[0.13rem] rounded">{club.genre1}</span>
                <span className="bg-gray500 text-gray100 text-xs px-[0.38rem] py-[0.13rem] rounded">{club.genre2}</span>
              </div>
              <h3 className="text-white text-[2rem] font-bold">{club.name}</h3>
              <div className="flex items-center space-x-[0.25rem] text-white mt-[1.03rem]">
                <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20}  />
                <span>{club.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}