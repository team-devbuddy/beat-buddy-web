'use client';
import { useRecoilValue } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import VenueHours from './VenueHours';
import { useRouter } from 'next/navigation';

const ClickedClubDetails = ({
  likedClubs,
  heartbeatNums,
  handleHeartClickWrapper,
}: {
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}) => {
  const clickedClub = useRecoilValue(clickedClubState);
  const router = useRouter();
  if (!clickedClub) return null;

  const imageUrls =
    clickedClub.venue.backgroundUrl?.filter((url) => url.match(/\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i)) || [];
  const firstImageUrl = imageUrls[0] || clickedClub.venue.logoUrl || '/images/DefaultImage.png';

  return (
    <div>
      <motion.div
        whileHover={{
          boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.08)',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
        className="relative flex w-full cursor-pointer flex-col rounded-[0.5rem] bg-BG-black p-5">
        {/* 상단: 클럽명 + 하트 */}
        <div className="flex items-start justify-between">
          <h2
            className="text-title-24-bold text-white"
            onClick={() => {
              router.push(`/detail/${clickedClub.venue.venueId}`);
            }}>
            {clickedClub.venue.englishName}
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleHeartClickWrapper(e, clickedClub.venue.venueId!);
            }}
            className="absolute right-5 top-5">
            <Image
              src={likedClubs[clickedClub.venue.venueId!] ? '/icons/FilledHeart.svg' : '/icons/whiteHeart.svg'}
              alt="heart"
              width={28}
              height={28}
            />
          </button>
        </div>

        {/* 태그 */}
        <div className="mt-[0.38rem] flex flex-wrap gap-2">
          {clickedClub.tagList?.length > 0 ? (
            clickedClub.tagList.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="rounded-[0.5rem] bg-gray700 px-2 py-1 text-body-13-medium text-gray300">
                {tag}
              </span>
            ))
          ) : (
            <span className="rounded-[0.5rem] bg-gray700 px-2 py-1 text-body-13-medium text-gray200">No Tags</span>
          )}
        </div>

        {/* 상태 & 주소 */}
        <div className="mt-3 flex flex-col gap-1 text-body-12-medium text-gray300">
          <VenueHours operationHours={clickedClub.venue.operationHours || {}} />
          <p className="flex items-center gap-1 text-body-12-medium">
            <Image src="/icons/location-map.svg" alt="location" width={12} height={12} />
            <span>{clickedClub.venue.address}</span>
            <span className="text-body-11-medium text-main">길찾기</span>
          </p>
        </div>

        {/* 이미지 갤러리 */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, idx) => (
              <div key={idx} className="relative h-[10rem] w-[10rem] flex-shrink-0 rounded-[0.5rem] overflow-hidden">
                <Image
                  src={url}
                  alt={`${clickedClub.venue.englishName} image ${idx}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '10rem', height: '10rem', objectFit: 'cover' }}
                  className="rounded-[0.5rem] object-cover"
                />
              </div>
            ))
          ) : (
            <div className="relative h-[10rem] w-[10rem] flex-shrink-0 rounded-[0.5rem]">
              <Image src={firstImageUrl} alt="default" layout="fill" objectFit="cover" className="rounded-md" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ClickedClubDetails;
