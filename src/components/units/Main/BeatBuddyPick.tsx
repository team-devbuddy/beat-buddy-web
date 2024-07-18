'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { BBPProps } from '@/lib/types';

export default function BeatBuddyPick() {
  const [clubs, setClubs] = useState<BBPProps[]>([]);
  const [likedClubs, setLikedClubs] = useState<{ [key: number]: boolean }>({});
  const accessToken = useRecoilValue(accessTokenState);
  console.log(clubs);

  useEffect(() => {
    const fetchClubs = async (token: string) => {
      try {
        const data = await getBBP(token);
        setClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    if (accessToken) {
      fetchClubs(accessToken);
    }
  }, [accessToken]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, accessToken);
  };

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
          <Link key={club.venueId} href={`/detail/${club.venueId}`} passHref>
            <div className="relative mt-[0.5rem] min-w-[15rem] cursor-pointer snap-center overflow-hidden rounded-md custom-club-card">
              <Image
                src={'/images/DefaultImage.png'} // 아직 url이 없어서 디폴트이미지 사용하지만 수정할거임
                alt={`${club.englishName} image`}
                layout="fill"
                className="object-cover"
              />
              <div
                className="absolute right-[1.5rem] top-[1.5rem] cursor-pointer"
                onClick={(e) => handleHeartClickWrapper(e, club.venueId)}
              >
                <Image
                  src={likedClubs[club.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                  alt="pink-heart icon"
                  width={32}
                  height={32}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-title-32 text-white">{club.englishName}</h3> 
                <div className="z-100 mt-[1.03rem] flex items-center space-x-[0.25rem] text-body3-12-medium text-gray300">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20} />
                  <span>{/* {club.likes} */}</span> {/* 아직 likes 값이 없어 주석처리 */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
