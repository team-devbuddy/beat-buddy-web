'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';

interface BeatBuddyPickProps {
  clubs: Club[];
  userName: string | null;
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

  const genreTags = tags.filter((tag) => genres.includes(tag));
  if (genreTags.length > 0) selectedTags.push(...genreTags.slice(0, 2));

  return selectedTags.slice(0, 3);
};

export default function BeatBuddyPick({
  clubs,
  userName,
  likedClubs,
  heartbeatNums,
  handleHeartClickWrapper,
}: BeatBuddyPickProps) {
  return (
    <div className="mt-[0.44rem] flex flex-col bg-BG-black">
      <Link href="/bbp-list" passHref>
        <div className="flex cursor-pointer items-center justify-between px-4 py-[1.25rem] hover:brightness-75">
          <span className="font-queensides text-[1.5rem] text-main2">
            {userName ? `Venue for ${userName}버디` : 'BeatBuddy Pick'}
          </span>
          <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
      <div
        className={`flex ${clubs.length > 1 ? 'space-x-[0.5rem]' : ''} snap-x snap-mandatory overflow-x-auto px-[1rem] hide-scrollbar`}>
        {clubs.map((club) => {
          const imageUrl = club.backgroundUrl?.[0] || club.logoUrl || '/images/DefaultImage.png';
          const filteredTags = getFilteredTags(club.tagList || []);
          return (
            <Link key={club.venueId} href={`/detail/${club.venueId}`} passHref>
              <div className="relative mt-[0.5rem] min-w-[15rem] cursor-pointer snap-center overflow-hidden rounded-md custom-club-card">
                <Image src={imageUrl} alt={`${club.englishName} image`} layout="fill" className="object-cover" />
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
                  <h3 className="mt-[0.5rem] text-title-32 text-white">{club.englishName}</h3>
                  <div className="z-100 mt-[1.03rem] flex items-center space-x-[0.25rem] text-body3-12-medium text-gray300">
                    <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={20} />
                    <span>{heartbeatNums[club.venueId] !== undefined ? heartbeatNums[club.venueId] : 0}</span>
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
