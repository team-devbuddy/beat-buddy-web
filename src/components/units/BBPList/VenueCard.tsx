'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';

interface VenueCardProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const VenueCard = ({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: VenueCardProps) => {
  const [clickedHeart, setClickedHeart] = useState<{ [key: number]: boolean }>({});

  const handleHeartClick = (e: React.MouseEvent, venueId: number) => {
    setClickedHeart((prev) => ({ ...prev, [venueId]: true }));
    handleHeartClickWrapper(e, venueId);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [venueId]: false })), 500);
  };

  const translateTag = (tag: string) => {
    const atmosphereMap: { [key: string]: string } = {
      CLUB: '클럽',
      PUB: '펍',
      ROOFTOP: '루프탑',
      DEEP: '딥한',
      COMMERCIAL: '커머셜한',
      CHILL: '칠한',
      EXOTIC: '이국적인',
      HUNTING: '헌팅',
    };

    const genresMap: { [key: string]: string } = {
      HIPHOP: 'HIPHOP',
      'R&B': 'R&B',
      EDM: 'EDM',
      HOUSE: 'HOUSE',
      TECHNO: 'TECHNO',
      'SOUL&FUNK': 'SOUL&FUNK',
      ROCK: 'ROCK',
      LATIN: 'LATIN',
      'K-POP': 'K-POP',
      POP: 'POP',
    };

    const locationsMap: { [key: string]: string } = {
      HONGDAE: '홍대',
      ITAEWON: '이태원',
      'GANGNAM/SINSA': '강남/신사',
      APGUJEONG: '압구정',
      OTHERS: '기타',
    };

    return atmosphereMap[tag] || genresMap[tag] || locationsMap[tag] || tag;
  };

  const getImageSrc = (club: Club) => {
    if (club.backgroundUrl.length > 0) {
      const firstImage = club.backgroundUrl.find((url) => url.match(/\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i));
      if (firstImage) {
        return firstImage;
      } else {
        const firstNonVideoImage = club.backgroundUrl.find((url) => !url.match(/\.mp4$/i));
        return firstNonVideoImage || club.logoUrl || '/images/DefaultImage.png';
      }
    }
    return club.logoUrl || '/images/DefaultImage.png';
  };

  return (
    <div className="bg-BG-black px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {clubs.map((club) => (
          <div key={club.venueId} className="relative mb-[2.5rem] flex flex-col bg-BG-black">
            <Link href={`/detail/${club.venueId}`} passHref>
              <div className="relative w-full pb-[100%]">
                <Image
                  src={getImageSrc(club)}
                  alt={`${club.englishName} image`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-sm"
                />
                <div className="club-gradient absolute inset-0"></div>
                <motion.div
                  className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                  onClick={(e) => handleHeartClick(e, club.venueId)}
                  variants={heartAnimation}
                  initial="initial"
                  animate={clickedHeart[club.venueId] ? 'clicked' : 'initial'}
                >
                  <Image
                    src={likedClubs[club.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                    alt="pink-heart icon"
                    width={32}
                    height={32}
                  />
                </motion.div>
              </div>
            </Link>
            <div className="mt-[1rem]">
              <h3 className="text-ellipsis text-body1-16-bold text-white">{club.englishName}</h3>
              <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
                {club.tagList?.length > 0 ? (
                  club.tagList.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                      {translateTag(tag)}
                    </span>
                  ))
                ) : (
                  <span className="text-body3-12-medium text-gray100">No Tags</span>
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
      </div>
    </div>
  );
};

export default VenueCard;
