'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HotChartProps } from '@/lib/types';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';

interface ClubsListProps {
  clubs: HotChartProps[];
}

function ClubList({ clubs }: ClubsListProps) {
  const [likedClubs, setLikedClubs] = useState<{ [key: number]: boolean }>({});
  const accessToken = useRecoilValue(accessTokenState);
console.log(accessToken)
  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, accessToken);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1.19rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
        {clubs.map((venue) => {
          console.log('venue:', venue);
          return (
            <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
              <div className="relative flex flex-col">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={/*club.imageUrl*/'/images/DefaultImage.png'} // 아직 url이 없어서 디폴트이미지 사용하지만 수정할거임
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
                <div className="mt-[1rem]">
                  <h3 className="text-ellipsis text-body1-16-bold text-white">{venue.koreanName}</h3>
                  <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
                    {/*{ 수정하깁
                      venue.tags && venue.tags.length > 0 ? (
                        venue.tags.map((tag, index) => (
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
                      )
                    }*/}
                  </div>
                  <div className="flex items-center space-x-[0.25rem] text-gray300">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                    {/* <span className="text-body3-12-medium">{venue.likes || 0}</span>*/}
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
