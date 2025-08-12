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
  lastClubRef?: (node: HTMLDivElement | null) => void;
  hasMore?: boolean;
  isLoading?: boolean;
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
  let selectedTags = [];

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

export default function ClubList({
  clubs,
  likedClubs,
  heartbeatNums,
  handleHeartClickWrapper,
  lastClubRef,
  hasMore,
  isLoading,
}: ClubsListProps) {
  const [clickedHeart, setClickedHeart] = useState<{ [key: number]: boolean }>({});

  console.log('🎯 ClubList 렌더링:', {
    clubsLength: clubs.length,
    hasMore,
    isLoading,
    lastClubRefExists: !!lastClubRef,
  });

  const memoizedValues = useMemo(() => {
    return clubs.map((club) => ({
      firstImageUrl: getImageSrc(club),
      filteredTags: getFilteredTags(club.tagList || []),
    }));
  }, [clubs]);

  const handleHeartClick = (e: React.MouseEvent, venueId: number) => {
    setClickedHeart((prev) => ({ ...prev, [venueId]: true }));
    handleHeartClickWrapper(e, venueId);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [venueId]: false })), 500);
  };

  return (
    <div className="flex w-full flex-col bg-BG-black">
      <div className="grid grid-cols-2 gap-x-[1rem] gap-y-[1.5rem] sm:grid-cols-2 md:grid-cols-3">
        {clubs.map((venue, index) => {
          const { firstImageUrl, filteredTags } = memoizedValues[index];
          const isLastItem = index === clubs.length - 1;
          const shouldSetRef = isLastItem && hasMore && !isLoading;

          return (
            <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
              <motion.div
                ref={shouldSetRef ? lastClubRef : undefined}
                whileHover={{
                  y: -5,
                }}
                className="relative flex h-full flex-col rounded-[0.5rem]">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={firstImageUrl}
                    alt={`${venue.koreanName} image`}
                    fill
                    objectFit="cover"
                    className="rounded-[0.5rem]"
                  />
                  <motion.div
                    className="absolute bottom-[0.62rem] left-[0.62rem] flex items-center space-x-[0.25rem]"
                    initial="initial"
                    animate="initial">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={15.6} height={13.7} />
                    <span className="text-body3-12-medium text-gray300">
                      {heartbeatNums[venue.venueId] !== undefined
                        ? String(heartbeatNums[venue.venueId]).padStart(3, '0')
                        : '000'}
                    </span>
                  </motion.div>
                  <div className="club-gradient absolute inset-0"></div>
                  <motion.div
                    className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleHeartClick(e, venue.venueId);
                    }}
                    variants={heartAnimation}
                    initial="initial"
                    animate={clickedHeart[venue.venueId] ? 'clicked' : 'initial'}>
                    <Image
                      src={likedClubs[venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
                      alt="heart icon"
                      width={27}
                      height={24}
                    />
                  </motion.div>
                </div>
                <div className="mt-[0.75rem] flex flex-grow flex-col justify-between">
                  <div>
                    <h3 className="text-body-14-bold text-ellipsis text-white">{venue.englishName}</h3>
                    <div className="mt-[0.38rem] flex flex-wrap gap-[0.25rem]">
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag, index) => (
                          <span
                            key={`${venue.venueId}-${tag}-${index}`}
                            className="text-body-11-medium rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-gray300">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span
                          key={`${venue.venueId}-no-tags`}
                          className="text-body-11-medium rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-gray300">
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
