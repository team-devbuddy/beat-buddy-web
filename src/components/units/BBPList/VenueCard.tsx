'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';

interface ClubsListProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const clubTypes = ['club', 'pub', 'rooftop'];
const regions = ['HONGDAE', 'ITAEWON', 'APGUJEONG', 'GANGNAM/SINSA', 'OTHERS'];
const regionTranslations: { [key: string]: string } = {
  HONGDAE: '홍대',
  ITAEWON: '이태원',
  APGUJEONG: '압구정',
  'GANGNAM/SINSA': '강남/신사',
  OTHERS: '기타',
};
const genres = [
  'HIPHOP',
  'R&B',
  'EDM',
  'HOUSE',
  'TECHNO',
  'SOUL&FUNK',
  'ROCK',
  'LATIN',
  'K-POP',
  'POP',
  'DEEP',
  'COMMERCIAL',
  'CHILL',
  'EXOTIC',
  'HUNTING',
];

const getFilteredTags = (tags: string[]) => {
  let selectedTags: string[] = [];

  const clubType = tags.find((tag) => clubTypes.includes(tag.toLowerCase()));
  if (clubType) selectedTags.push(clubType);

  const region = tags.find((tag) => regions.includes(tag));
  if (region) selectedTags.push(regionTranslations[region] || region);

  const genre = tags.find((tag) => genres.includes(tag));
  if (genre) selectedTags.push(genre);

  return selectedTags.slice(0, 3);
};

const getImageSrc = (club: Club) => {
  const isImage = (url: string) => /\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.mp4$/i.test(url);

  if (club.backgroundUrl && club.backgroundUrl.length > 0) {
    const firstNonVideoImage = club.backgroundUrl.find(isImage);
    if (firstNonVideoImage) {
      return firstNonVideoImage;
    }
  }

  if (club.logoUrl && isImage(club.logoUrl)) {
    return club.logoUrl;
  }

  return '/images/DefaultImage.png';
};

export default function ClubList({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: ClubsListProps) {
  const [clickedHeart, setClickedHeart] = useState<{ [key: number]: boolean }>({});

  const memoizedValues = useMemo(() => {
    return clubs.map((club) => ({
      firstImageUrl: getImageSrc(club),
      filteredTags: getFilteredTags(club.tagList || []),
    }));
  }, [clubs]);

  const handleHeartClick = (e: React.MouseEvent, venueId: number) => {
    setClickedHeart((prev) => ({ ...prev, [venueId]: true }));
    handleHeartClickWrapper(e, venueId);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [venueId]: false })), 500); // 애니메이션이 끝난 후 상태를 리셋
  };

  return (
    <div className="flex w-full flex-col bg-BG-black">
      <div className="mb-[2.5rem] grid grid-cols-1 gap-x-[0.5rem] gap-y-[1.5rem] px-[0.75rem] sm:grid-cols-2">
        {clubs.map((venue, index) => {
          const { firstImageUrl, filteredTags } = memoizedValues[index];

          return (
            <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={{
                  y: -5,
                  boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
                className="relative flex h-full flex-col rounded-[1.25rem] p-2">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={firstImageUrl}
                    alt={`${venue.koreanName} image`}
                    fill
                    objectFit="cover"
                    className="rounded-[1.25rem]"
                  />
                  <div className="club-gradient absolute inset-0"></div>

                  {/* 하트 버튼 */}
                  <motion.div
                    className="absolute right-5 top-5 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (venue.venueId !== undefined) {
                        handleHeartClick(e, venue.venueId);
                      }
                    }}
                    variants={heartAnimation}
                    initial="initial"
                    animate={clickedHeart[venue.venueId!] ? 'clicked' : 'initial'}>
                    <Image
                      src={likedClubs[venue.venueId!] ? '/icons/FilledHeart.svg' : '/icons/whiteHeart.svg'}
                      alt="heart icon"
                      width={27}
                      height={27}
                    />
                  </motion.div>

                  {/* 하트 개수 - 왼쪽 하단 고정 */}
                  <div className="absolute bottom-5 left-7 flex items-center space-x-[0.25rem] text-gray100">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={15} height={13} />
                    <span className="text-body-14-medium">
                      {heartbeatNums[venue.venueId!] !== undefined
                        ? heartbeatNums[venue.venueId!].toString().padStart(3, '0')
                        : '000'}
                    </span>
                  </div>
                </div>
                <div className="mt-[1rem] flex flex-grow flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-ellipsis text-subtitle-20-bold text-white">{venue.englishName}</h3>
                    </div>
                    <div className="mt-[0.25rem] flex w-2/3 flex-wrap gap-[0.5rem]">
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-body-13-medium text-gray300">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-body-13-medium text-gray300">
                          No tagList
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
