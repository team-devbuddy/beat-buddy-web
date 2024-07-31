'use client';
import { useRecoilValue } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const getFilteredTags = (tags: string[]) => {
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

  let selectedTags = [];

  const clubType = tags.find((tag) => clubTypes.includes(tag.toLowerCase()));
  if (clubType) selectedTags.push(clubType);

  const region = tags.find((tag) => regions.includes(tag));
  if (region) selectedTags.push(regionTranslations[region] || region);

  const genre = tags.find((tag) => genres.includes(tag));
  if (genre) selectedTags.push(genre);

  return selectedTags.slice(0, 3);
};

interface ClickedClubDetailsProps {
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const ClickedClubDetails = ({ likedClubs, heartbeatNums, handleHeartClickWrapper }: ClickedClubDetailsProps) => {
  const clickedClub = useRecoilValue(clickedClubState);

  if (!clickedClub) return null;

  const firstImageUrl =
    clickedClub.venue.backgroundUrl.find((url) => url.match(/\.(jpeg|jpg|gif|png|heic|jfif)$/i)) ||
    clickedClub.venue.logoUrl ||
    '/images/DefaultImage.png';

  const filteredTags = getFilteredTags(clickedClub.tagList || []);

  return (

    <Link key={clickedClub.venue.venueId} href={`/detail/${clickedClub.venue.venueId}`} passHref>
      <div className="flex w-full cursor-pointer flex-col bg-BG-black p-4">
        <motion.div
          whileHover={{
            y: -5,
            boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          className="relative flex p-2 flex-row gap-x-[1.25rem] rounded-md">
          <div className="relative h-40 w-40">
            <Image
              src={firstImageUrl}
              alt={`${clickedClub.venue.koreanName} image`}
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
            <div
              className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
              onClick={(e) => {
                handleHeartClickWrapper(e, clickedClub.venue.venueId);
              }}>
              <Image
                src={likedClubs[clickedClub.venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                alt="pink-heart icon"
                width={32}
                height={32}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-ellipsis text-body1-16-bold text-white">{clickedClub.venue.englishName}</h3>
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
            <div className="flex items-center space-x-[0.25rem] text-gray300">
              <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
              <span className="text-body3-12-medium">
                {heartbeatNums[clickedClub.venue.venueId] !== undefined ? heartbeatNums[clickedClub.venue.venueId] : 0}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

export default ClickedClubDetails;
