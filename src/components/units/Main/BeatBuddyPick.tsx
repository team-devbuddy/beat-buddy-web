'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { getUserName } from '@/lib/actions/user-controller/fetchUsername';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { BBPProps } from '@/lib/types';

export default function BeatBuddyPick() {
  const [clubs, setClubs] = useState<BBPProps[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);

  useEffect(() => {
    const fetchBBP = async (token: string) => {
      try {
        const data = await getBBP(token);
        setClubs(data);

        const likedStatuses = await Promise.all(
          data.map(async (club: { venueId: number }) => {
            const isLiked = await checkHeart(club.venueId, token);
            return { [club.venueId]: isLiked };
          })
        );

        const likedStatusesObj = likedStatuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLikedClubs(likedStatusesObj);

        const heartbeatNumsObj = data.reduce((acc: { [x: string]: any }, club: { venueId: string | number; heartbeatNum: any }) => {
          acc[club.venueId] = club.heartbeatNum;
          return acc;
        }, {});
        setHeartbeatNums(heartbeatNumsObj);
      } catch (error) {
        console.error('Error fetching BBP:', error);
      }
    };

    const fetchUserName = async (token: string) => {
      try {
        const name = await getUserName(token);
        setUserName(name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    if (accessToken) {
      fetchBBP(accessToken);
      fetchUserName(accessToken);
    }
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트가 실행되지 않도록 방지
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="mt-[0.44rem] flex flex-col">
      <Link href="/bbp-list" passHref>
        <div className="flex cursor-pointer items-center justify-between px-[1rem] py-[1.25rem]">
          <span className="font-queensides text-[1.5rem] text-main2">
            {userName ? `Venue for ${userName}버디` : 'BeatBuddy Pick'}
          </span>
          <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
      <div className="flex snap-x snap-mandatory space-x-[0.5rem] overflow-x-auto px-[1rem] hide-scrollbar">
        {clubs.map((club) => (
          <Link key={club.venueId} href={`/detail/${club.venueId}`} passHref>
            <div className="relative mt-[0.5rem] min-w-[15rem] cursor-pointer snap-center overflow-hidden rounded-md custom-club-card">
              <Image
                src={'/images/DefaultImage.png'}
                alt={`${club.englishName} image`}
                layout="fill"
                className="object-cover"
              />
              <div
                className="absolute right-[1.5rem] top-[1.5rem] cursor-pointer"
                onClick={(e) => handleHeartClickWrapper(e, club.venueId)}>
                <Image
                  src={likedClubs[club.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                  alt="pink-heart icon"
                  width={32}
                  height={32}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
                  {club.tagList.length > 0 ? (
                    club.tagList.map((tag, index) => (
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
                <h3 className="mt-[0.5rem] text-title-32 text-white">{club.englishName}</h3>
                <div className="z-100 mt-[1.03rem] flex items-center space-x-[0.25rem] text-body3-12-medium text-gray300">
                  <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20} />
                  <span>{heartbeatNums[club.venueId] !== undefined ? heartbeatNums[club.venueId] : 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
