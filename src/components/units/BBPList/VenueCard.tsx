'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { BBPProps } from '@/lib/types';

const VenueCard = () => {
  const [clubs, setClubs] = useState<BBPProps[]>([]);
  const [likedClubs, setLikedClubs] = useState<{ [key: number]: boolean }>({});
  const accessToken = useRecoilValue(accessTokenState);

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
    <>
      {clubs.map((club) => (
        <div key={club.venueId} className="relative mb-4 flex flex-col">
          <Link href={`/detail/${club.venueId}`} passHref>
            <div className="relative w-full pb-[100%]">
              <Image
                src={'/images/DefaultImage.png'} // 기본 이미지 URL 사용
                alt={`${club.englishName} image`}
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
              />
              <div className="club-gradient absolute inset-0"></div>
              <div
                className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                onClick={(e) => handleHeartClickWrapper(e, club.venueId)}>
                <Image
                  src={likedClubs[club.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                  alt="pink-heart icon"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </Link>
          <div className="mt-[1rem]">
            <h3 className="text-ellipsis text-body1-16-bold text-white">{club.englishName}</h3>
            <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
              {/* {club.tags.map((tag, index) => (
                <span key={index} className="bg-gray500 text-gray100 text-body3-12-medium px-[0.38rem] py-[0.13rem] border border-gray500 rounded-xs">{tag}</span>
              ))} */}
            </div>
            <div className="flex items-center space-x-[0.25rem] text-gray300">
              <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
              {/* <span className='text-body3-12-medium'>{club.likes}</span> */}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VenueCard;
