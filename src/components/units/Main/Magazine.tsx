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
}

export default function Magazine({
  magazineId,
  thumbImageUrl,
  title,
  content,
  totalCount,
  orderInHome,
}: MagazineCardProps) {
  const router = useRouter();

  return (
    <Link href={`/magazine/${magazineId}`}>
      {/* 정사각형으로 변경: w-[20rem] h-[20rem] */}
      <div className="relative h-[20rem] w-[20rem] cursor-pointer overflow-hidden rounded-xl shadow-lg">
        <Image
          src={thumbImageUrl || '/images/DefaultImage.png'}
          alt={title}
          layout="fill"
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
            className="flex items-center justify-center rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-black/70">
            전체보기
          </button>
        </div>

        {/* 하단 콘텐츠 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-[1.5rem] text-white">
          <span className="mb-2 inline-block rounded-md bg-[#F93A7B] px-[0.56rem] py-[0.25rem] text-[0.75rem] text-white">
            BeatBuddy Pick!
          </span>

          <h2 className="text-[1.5rem] font-semibold leading-tight drop-shadow-md">{title}</h2>
          <div className="my-[0.75rem] h-[0.03125rem] w-full bg-gray200" />
          <p className="text-[0.75rem] font-light text-gray200 drop-shadow-md">{content}</p>
        </div>
      </div>
    </Link>
  );
}
