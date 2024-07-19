'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { BBPProps } from '@/lib/types';

type HeartbeatNums = {
  [key: number]: number;
};

const VenueCard = () => {
  const [clubs, setClubs] = useState<BBPProps[]>([]);
  const likedClubs = useRecoilValue(likedClubsState);
  const setLikedClubs = useSetRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState<HeartbeatNums>(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchClubs = async (token: string) => {
      try {
        const data = await getBBP(token);
        setClubs(data);

        // 각 클럽에 대해 하트 상태를 확인
        const likedStatuses = await Promise.all(
          data.map(async (club: { venueId: number }) => {
            const isLiked = await checkHeart(club.venueId, token);
            return { [club.venueId]: isLiked };
          }),
        );

        // likedStatuses를 하나의 객체로 병합
        const likedStatusesObj = likedStatuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLikedClubs(likedStatusesObj);

        // 하트 비트 넘버 설정
        const heartbeatNumsObj: HeartbeatNums = data.reduce(
          (acc: { [x: string]: any }, club: { venueId: number; heartbeatNum: number }) => {
            acc[club.venueId] = club.heartbeatNum;
            return acc;
          },
          {} as HeartbeatNums,
        );
        setHeartbeatNums(heartbeatNumsObj);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    const fetchLikedStatuses = async (token: string) => {
      try {
        const heartbeats = await getMyHearts(token);
        const likedStatuses = heartbeats.reduce(
          (acc, heartbeat) => {
            acc[heartbeat.venueId] = true;
            return acc;
          },
          {} as { [key: number]: boolean },
        );

        setLikedClubs(likedStatuses);
      } catch (error) {
        console.error('Error fetching liked statuses:', error);
      }
    };

    if (accessToken) {
      fetchClubs(accessToken);
      fetchLikedStatuses(accessToken);
    }
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
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
            <div className="flex items-center space-x-[0.25rem] text-gray300">
              <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
              <span className="text-body3-12-medium">
                {heartbeatNums[club.venueId] !== undefined ? heartbeatNums[club.venueId] : 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default VenueCard;
