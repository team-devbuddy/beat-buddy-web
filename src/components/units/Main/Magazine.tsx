// components/CuratedPickCard.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MagazineProps } from '@/lib/types';
// 이 컴포넌트가 받을 props의 타입을 정의합니다.


export default function Magazine({
  magazineId,
  thumbImageUrl,
  title,
  content,
}: MagazineProps) {
  return (
    // Link 컴포넌트로 전체를 감싸 클릭 가능한 카드로 만듭니다.
    <Link href={`/magazine/${magazineId}`} passHref>
      <div className="relative mx-auto h-[24rem] w-full max-w-[400px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
        {/* 배경 이미지 */}
        <Image
          src={thumbImageUrl}
          alt={title}
          layout="fill"
          className="object-cover"
          // 이미지 로딩 실패 시 기본 이미지
          onError={(e) => {
            e.currentTarget.src = '/images/DefaultImage.png';
          }}
        />

        {/* 텍스트 가독성을 위한 어두운 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* 우측 상단 페이지네이션 */}
        <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
          {magazineId}
        </div>

        {/* 하단 텍스트 컨텐츠 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
          {/* BeatBuddy Pick! 뱃지 */}
          <span className="mb-2 inline-block rounded-md bg-[#F93A7B] px-3 py-1 text-sm font-bold text-white">
            BeatBuddy Pick!
          </span>

          {/* 메인 타이틀 */}
          <h2 className="mb-2 text-3xl font-bold leading-tight drop-shadow-md">
            {title}
          </h2>

          {/* 서브 타이틀 */}
          <p className="text-base text-gray-200 drop-shadow-md">{content}</p>
        </div>
      </div>
    </Link>
  );
}