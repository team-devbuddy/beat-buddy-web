'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MagazineCardProps {
  magazineId: number;
  thumbImageUrl: string;
  title: string;
  content: string;
  totalCount: number;
  orderInHome: number;
  picked: boolean;
}

export default function Magazine({
  magazineId,
  thumbImageUrl,
  title,
  content,
  totalCount,
  orderInHome,
  picked,
}: MagazineCardProps) {
  const router = useRouter();

  return (
    <Link href={`/magazine/${magazineId}`}>
      {/* 양쪽 1.25rem 패딩을 고려한 너비 */}
      <div className="relative h-[calc(100vw_-_2.5rem)] max-h-[21rem] w-[calc(100vw_-_2.5rem)] max-w-none cursor-pointer overflow-hidden rounded-xl shadow-lg md:max-h-[21rem] md:max-w-[21rem]">
        <Image
          src={thumbImageUrl || '/images/DefaultImage.png'}
          alt={title}
          fill
          sizes="(max-width: 768px) calc(100vw - 2.5rem), (max-width: 1200px) 22rem, 22rem"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/DefaultImage.png';
          }}
        />

        {/* 상단 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* 우측 상단 - 전체보기 마크 */}
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={(e) => {
              e.preventDefault(); // 부모 링크 막기
              router.push('/magazine');
            }}
            className="flex items-center justify-center rounded-[0.5rem] bg-black/70 px-[0.38rem] py-[0.19rem] text-[0.6875rem] font-medium text-gray200">
            {orderInHome} | {totalCount}
            <Image className="ml-[0.12rem]" src="/icons/rightArrowMagazine.svg" alt="Arrow head right icon" width={8.75} height={14} />
          </button>
        </div>

        {/* 하단 콘텐츠 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-[1.5rem] text-white">
          {picked ? (
            <span className="inline-block rounded-[0.5rem] bg-[#F93A7B] px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-white">
              BeatBuddy Pick!
            </span>
          ) : (
            <span className="inline-block rounded-[0.5rem] bg-[#F93A7B] px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-white">
              Magazine
            </span>
          )}

          <h2 className="line-height-[140%] py-2 text-[1.375rem] font-bold tracking-[-0.0275rem] drop-shadow-md">
            {title.split('\n').map((line, index, array) => (
              <span key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p
            className="line-height-[150%] text-[0.8125rem] tracking-[-0.01625rem] text-[#FFFFFF] drop-shadow-md"
            style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
            {content}
          </p>
        </div>
      </div>
    </Link>
  );
}
