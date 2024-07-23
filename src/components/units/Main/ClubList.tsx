'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getHotChart } from '@/lib/actions/hearbeat-controller/getHotChart';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { HotChartProps } from '@/lib/types';

interface ClubsListProps {
  clubs: HotChartProps[];
}

function ClubList({ clubs }: ClubsListProps) {
  const [hotClubs, setHotClubs] = useState<HotChartProps[]>([]);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchHotChart = async (token: string) => {
      try {
        const data = await getHotChart(token);
        setHotClubs(data);

        // 각 클럽에 대해 하트 상태를 확인
        const likedStatuses = await Promise.all(
          data.map(async (club: { venueId: number; }) => {
            const isLiked = await checkHeart(club.venueId, token);
            return { [club.venueId]: isLiked };
          })
        );

        // likedStatuses를 하나의 객체로 병합
        const likedStatusesObj = likedStatuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLikedClubs(likedStatusesObj);

        // 하트 비트 넘버 설정
        setHeartbeatNums(
          data.reduce((acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number; }) => {
            acc[club.venueId] = club.heartbeatNum;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching hot chart:', error);
      }
    };

    if (accessToken) {
      fetchHotChart(accessToken);
    }
  }, [accessToken]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1.19rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
        {hotClubs.map((venue) => (
          <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
            <div className="relative flex h-full flex-col">
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
                  onClick={(e) => handleHeartClickWrapper(e, venue.venueId)}
                >
                  <Image
                    src={likedClubs[venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                    alt="pink-heart icon"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
              <div className="mt-[1rem] flex flex-grow flex-col justify-between">
                <div>
                  <h3 className="text-ellipsis text-body1-16-bold text-white">{venue.englishName}</h3>
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
                <div className="flex items-end justify-between">
                  <div className="flex items-center space-x-[0.25rem] text-gray300">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                    <span className="text-body3-12-medium">{heartbeatNums[venue.venueId]}</span>
                  </div>
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
