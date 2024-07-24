'use client';

import Image from 'next/image';
import Link from 'next/link';

const VenueCardInfo = () => {
  return (
    <>
      <div className="relative mb-4 flex flex-col">
        <Link href={`/`} passHref>
          <div className="relative w-full">
            <Image
              alt="club-image"
              src={'/images/DefaultImage.png'} // 기본 이미지 URL 사용
              width={300}
              height={300}
              className="rounded-sm"
            />
            <div className="club-gradient absolute inset-0"></div>
            <div className="absolute bottom-[0.62rem] left-[7.5rem] cursor-pointer">
              <Image src={'/icons/FilledHeart.svg'} alt="pink-heart icon" width={32} height={32} />
            </div>
          </div>
        </Link>
        <div className="mt-[1rem]">
          <h3 className="text-ellipsis text-body1-16-bold text-white">클럽 이름</h3>
          <div className="mb-[1.06rem] mt-[0.75rem] flex flex-wrap gap-[0.5rem]">
            <span className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
              tag1
            </span>
          </div>
          <div className="flex items-center space-x-[0.25rem] text-gray300">
            <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
            <span className="text-body3-12-medium">
              {/* {heartbeatNums[club.venueId] !== undefined ? heartbeatNums[club.venueId] : 0} */}1
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VenueCardInfo;
