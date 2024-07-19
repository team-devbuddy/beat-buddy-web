'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { BBPProps } from '@/lib/types';

const VenueCard = () => {
  const [clubs, setClubs] = useState<BBPProps[]>([]);
  const likedClubs = useRecoilValue(likedClubsState);
  const setLikedClubs = useSetRecoilState(likedClubsState);
  const setHeartbeats = useSetRecoilState(heartbeatsState);
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

    const fetchLikedStatuses = async (token: string) => {
      try {
        const heartbeats = await getMyHearts(token);
        const likedStatuses = heartbeats.reduce((acc: { [key: number]: boolean }, heartbeat: { venueId: number }) => {
          acc[heartbeat.venueId] = true;
          return acc;
        }, {});

        setLikedClubs(likedStatuses);
      } catch (error) {
        console.error('Error fetching liked statuses:', error);
      }
    };

    if (accessToken) {
      fetchClubs(accessToken);
      fetchLikedStatuses(accessToken);
    }
  }, [accessToken, setLikedClubs]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeats, accessToken);
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
                onClick={(e) => handleHeartClickWrapper(e, club.venueId)}
              >
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
              {club.tagList?.length > 0 ? (
                club.tagList.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                  No Tags
                </span>
              )}
            </div>
            <div className="flex items-center space-x-[0.25rem] text-gray300">
              <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
              <span className='text-body3-12-medium'>{/* {club.likes} */}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VenueCard;
