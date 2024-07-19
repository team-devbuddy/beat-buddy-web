'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { HotChartProps } from '@/lib/types';

interface ClubsListProps {
  clubs: HotChartProps[];
}

function ClubList({ clubs }: ClubsListProps) {
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const setHeartbeats = useSetRecoilState(heartbeatsState);
  const heartbeats = useRecoilValue(heartbeatsState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchLikedStatuses = async (token: string) => {
      try {
        const heartbeats = await getMyHearts(token);
        const likedStatuses = heartbeats.reduce((acc: { [key: number]: boolean }, heartbeat: { venueId: number }) => {
          acc[heartbeat.venueId] = true;
          return acc;
        }, {});

        setHeartbeats(heartbeats);
        setLikedClubs(likedStatuses);
      } catch (error) {
        console.error('Error fetching liked statuses:', error);
      }
    };

    if (accessToken) {
      fetchLikedStatuses(accessToken);
    }
  }, [accessToken, clubs, setHeartbeats, setLikedClubs]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeats, accessToken);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1.19rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
        {clubs.map((venue) => {
          const heartbeat = heartbeats.find(hb => hb.venueId === venue.venueId);
          const heartbeatNum = heartbeat ? heartbeat.heartbeatNum : 0;

          return (
            <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
              <div className="relative flex flex-col h-full">
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
                <div className="mt-[1rem] flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-ellipsis text-body1-16-bold text-white">{venue.koreanName}</h3>
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
                  <div className="flex justify-between items-end">
                    <div className="flex items-center space-x-[0.25rem] text-gray300">
                      <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                      <span className="text-body3-12-medium">{heartbeatNum}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ClubList;
