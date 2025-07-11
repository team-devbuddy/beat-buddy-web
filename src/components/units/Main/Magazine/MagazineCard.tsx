'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MagazineProps } from '@/lib/types';
import { useState } from 'react';
import { postLikeMagazine } from '@/lib/actions/magazine-controller/postLikeMagazine';
import { deleteLikeMagazine } from '@/lib/actions/magazine-controller/deleteLikeMagazine';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface Props extends MagazineProps {}

export default function MagazineCard({
  magazineId,
  thumbImageUrl,
  title,
    content,
  orderInHome,
  totalCount,
  isLiked,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked); // 좋아요 상태
  const accessToken = useRecoilValue(accessTokenState);
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 이동 방지

    try {
      if (liked) {
        await deleteLikeMagazine(magazineId, accessToken ?? '');
      } else {
        await postLikeMagazine(magazineId, accessToken ?? '');
      }

      setLiked(!liked);
    } catch (err: any) {
        console.error('Error liking magazine:', err);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-[0.63rem] shadow-md mx-auto cursor-pointer"
      onClick={() => router.push(`/magazine/${magazineId}`)}
    >
      {/* 배경 이미지 */}
      <Image
        src={thumbImageUrl}
        alt={title}
        width={335}
        height={343}
        className="h-[21.4375rem] w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = '/images/DefaultImage.png';
        }}
      />

      {/* 상단 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />

      {/* 하트 아이콘 */}
      <div className="absolute right-[1.64rem] top-[1.75rem] z-10">
        <Image
          src={liked ? '/icons/FilledHeart.svg' : '/icons/GrayHeart.svg'}
          alt="heart icon"
          width={27}
          height={24}
          className="cursor-pointer"
          onClick={handleHeartClick}
        />
      </div>

      {/* 콘텐츠 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-[1.5rem] pb-[1.75rem] text-white">
        <span className="mb-2 inline-block rounded-[0.5rem] bg-[#F93A7B] px-[0.56rem] py-[0.25rem] text-[0.75rem] font-medium">
          BeatBuddy Pick!
        </span>

        <h2 className="text-[1.5rem] font-semibold leading-snug drop-shadow-md">
          {title}
        </h2>
        <div className="my-[0.75rem] h-px w-full bg-gray200" />

        <p className="text-xs text-gray200 font-light drop-shadow-md">{content}</p>
      </div>
    </div>
  );
}
