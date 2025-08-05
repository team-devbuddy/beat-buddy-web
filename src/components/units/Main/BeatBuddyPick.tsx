'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Club } from '@/lib/types';
import { heartAnimation } from '@/lib/animation';
import { motion } from 'framer-motion';

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

export default function BeatBuddyPick({
  clubs,
  userName,
  likedClubs,
  heartbeatNums,
  handleHeartClickWrapper,
}: BeatBuddyPickProps) {
  const [clickedHeart, setClickedHeart] = useState<{ [key: number]: boolean }>({});

  const handleHeartClick = (e: React.MouseEvent, venueId: number) => {
    setClickedHeart((prev) => ({ ...prev, [venueId]: true }));
    handleHeartClickWrapper(e, venueId);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [venueId]: false })), 500);
  };

  return (
    <div className="flex flex-col bg-BG-black">
      <div
        className={`flex ${clubs.length > 1 ? 'space-x-[0.5rem]' : ''} snap-x snap-mandatory overflow-x-auto bg-BG-black px-[1.25rem] hide-scrollbar`}>
        {clubs.map((club) => {
          const imageUrl = getImageSrc(club);
          const filteredTags = getFilteredTags(club.tagList || []);
          return (
            <Link key={club.id} href={`/detail/${club.id}`} passHref>
              <div className="relative mt-[0.5rem] min-w-[15rem] cursor-pointer snap-center overflow-hidden rounded-md custom-club-card">
                <Image src={imageUrl} alt={`${club.englishName} image`} layout="fill" className="object-cover" />
                <motion.div
                  className="absolute right-[1.5rem] top-[1.5rem] cursor-pointer"
                  onClick={(e) => handleHeartClick(e, club.id)}
                  variants={heartAnimation}
                  initial="initial"
                  animate={clickedHeart[club.id] ? 'clicked' : 'initial'}>
                  <Image
                    src={likedClubs[club.id] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                    alt="pink-heart icon"
                    width={32}
                    height={32}
                  />
                </motion.div>
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
                    <span>{heartbeatNums[club.id] !== undefined ? heartbeatNums[club.id] : 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Link href="/bbp-list" passHref>
        <div className="mx-4 my-[1.5rem] flex cursor-pointer items-center justify-between rounded-sm bg-main px-4 py-[0.5rem]">
          <div className="flex flex-col justify-center gap-y-2">
            <span className="font-queensides text-[1.5rem] text-white">
              {userName ? `Venue for ${userName}버디` : 'BeatBuddy Pick'}
            </span>
            <span className="text-body2-15-medium text-sub2">나에게 딱 맞는 베뉴들의 정보를 확인하세요!</span>
          </div>
          <Image src="/icons/rightArrowWhite.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
    </div>
  );
}
