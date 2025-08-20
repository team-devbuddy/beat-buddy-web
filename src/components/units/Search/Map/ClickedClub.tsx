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
    clickedClub.venue.backgroundUrl.find((url) => url.match(/\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i)) ||
    clickedClub.venue.logoUrl ||
    '/images/DefaultImage.png';

  const filteredTags = getFilteredTags(clickedClub.tagList || []);

  return (
    <Link key={clickedClub.venue.venueId} href={`/detail/${clickedClub.venue.venueId}`} passHref>
      <div className="flex w-full cursor-pointer flex-col bg-BG-black px-4">
        <motion.div
          whileHover={{
            boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          className="relative flex flex-row justify-between rounded-md p-2">
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
                handleHeartClickWrapper(e, clickedClub.venue.venueId!);
              }}>
              <Image
                src={likedClubs[clickedClub.venue.venueId!] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                alt="pink-heart icon"
                width={32}
                height={32}
              />
            </div>
          </div>
          <div className="flex max-w-[200px] flex-col justify-between">
            <div>
              <h3 className="text-ellipsis text-body1-16-bold text-white">{clickedClub.venue.englishName}</h3>
              <div className="mb-[0.5rem] mt-[0.38rem] flex flex-wrap gap-[0.5rem]">
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-[0.5rem] border border-gray500 bg-gray500 px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-gray300">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="rounded-[0.5rem] border border-gray500 bg-gray500 px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-gray300">
                    No tagList
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-[0.25rem] text-gray300">
                <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                <span className="text-body3-12-medium">
                  {heartbeatNums[clickedClub.venue.venueId!] !== undefined
                    ? heartbeatNums[clickedClub.venue.venueId!]
                    : 0}
                </span>
              </div>
            </div>

            {/* 지도 연결 버튼들 */}
            <div className="mt-4 flex justify-between gap-1 rounded-[0.25rem] bg-gray700 px-1 py-[0.19rem]">
              {/* 네이버지도 버튼 */}
              <div
                className="flex flex-1 items-center justify-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const address = encodeURIComponent(clickedClub.venue.address);
                  window.open(`https://map.naver.com/p/search/${address}`, '_blank');
                }}>
                <button
                  title="네이버지도에서 보기"
                  className="flex items-center justify-center rounded-full transition-colors">
                  <Image
                    src="/icons/image.png"
                    alt="네이버지도"
                    width={13}
                    height={13}
                    className="aspect-square object-cover"
                  />
                </button>
                <p className="whitespace-nowrap text-[0.6rem] text-gray200">네이버</p>
              </div>

              {/* 카카오지도 버튼 */}
              <div
                className="flex flex-1 items-center justify-center gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const address = encodeURIComponent(clickedClub.venue.address);
                  window.open(`https://map.kakao.com/link/search/${address}`, '_blank');
                }}>
                <button
                  title="카카오지도에서 보기"
                  className="flex items-center justify-center rounded-full transition-colors">
                  <Image
                    src="/icons/kakaomap_basic.png"
                    alt="카카오지도"
                    width={13}
                    height={13}
                    className="aspect-square object-cover"
                  />
                </button>
                <p className="whitespace-nowrap text-[0.6rem] text-gray200">카카오</p>
              </div>

              {/* 구글맵 버튼 */}
              <div className="flex flex-1 items-center justify-center gap-1">
                <button
                  title="구글맵에서 보기"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const address = encodeURIComponent(clickedClub.venue.address);
                    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
                  }}
                  className="flex items-center justify-center rounded-full transition-colors">
                  <Image
                    src="/icons/google_maps_icon_130921.svg"
                    alt="구글맵"
                    width={13}
                    height={13}
                    className="aspect-square object-cover"
                  />
                </button>
                <p className="whitespace-nowrap text-[0.6rem] text-gray200">구글맵</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

export default ClickedClubDetails;
