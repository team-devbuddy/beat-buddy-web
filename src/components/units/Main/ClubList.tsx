'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';
import { motion } from 'framer-motion';

interface ClubsListProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

//태그필터링!! 히히
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

export default function ClubList({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: ClubsListProps) {
  return (
    <div className="flex w-full bg-[#131415] border-[#131415] flex-col">
      <div className="mx-[1rem] my-[1.5rem] grid grid-cols-2 gap-x-[1rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-3">
        {clubs.map((venue) => {
          const firstImageUrl =
            venue.backgroundUrl.find((url) => url.match(/\.(jpeg|jpg|gif|png|heic|jfif)$/i)) ||
            venue.logoUrl ||
            '/images/DefaultImage.png';
          const filteredTags = getFilteredTags(venue.tagList || []);

          return (
            <Link key={venue.venueId} href={`/detail/${venue.venueId}`} passHref>
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
                className="relative flex h-full flex-col rounded-md ">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={firstImageUrl}
                    alt={`${venue.koreanName} image`}
                    fill
                    objectFit="cover"
                    className="rounded-sm"
                  />
                  <div className="club-gradient absolute inset-0"></div>
                  <div
                    className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleHeartClickWrapper(e, venue.venueId);
                    }}>
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
                    <div className="mb-[1.06rem] mt-[0.75rem] flex w-3/4 flex-wrap gap-[0.5rem]">
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                          No tagList
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-[0.25rem] text-gray300">
                      <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                      <span className="text-body3-12-medium">
                        {heartbeatNums[venue.venueId] !== undefined ? heartbeatNums[venue.venueId] : 0}
                      </span>
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
