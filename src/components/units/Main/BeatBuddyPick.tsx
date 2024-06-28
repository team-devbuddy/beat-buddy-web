import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clubs } from '@/lib/data';

export default function BeatBuddyPick() {
  return (
    <div className="mt-[0.44rem] flex flex-col">
      <Link href="/bbp-list" passHref>
        <div className="flex cursor-pointer items-center justify-between px-[1rem] py-[1.25rem]">
          <span className="font-queensides text-[1.5rem] text-main2">BeatBuddy Pick</span>
          <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
      <div className="flex snap-x snap-mandatory space-x-[0.5rem] overflow-x-auto px-[1rem] hide-scrollbar">
        {clubs.map((club) => (
          <Link key={club.id} href={`/detail/${club.id}`} passHref>
            <div className="relative mt-[0.5rem] min-w-[15rem] cursor-pointer snap-center overflow-hidden rounded-md custom-club-card">
              <Image src={club.imageUrl} alt={`${club.name} image`} layout="fill" className="object-cover" />
              <div className="absolute right-[1.5rem] top-[1.5rem] cursor-pointer">
                <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={32} height={32} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="mb-[0.75rem] flex space-x-[0.75rem]">
                  {club?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-title-32 text-white">{club.name}</h3>
                <div className="z-100 mt-[1.03rem] flex items-center space-x-[0.25rem] text-body3-12-medium text-gray300">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20} />
                  <span>{club.likes}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
