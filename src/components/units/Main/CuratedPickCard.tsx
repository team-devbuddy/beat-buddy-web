// components/CuratedPickCard.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MagazineProps } from '@/lib/types';

export default function CuratedPickCard({
  magazineId,
  thumbImageUrl,
  title,
  content,
}: MagazineProps) {
  return (
    <Link href={`/magazine/${magazineId}`}>
      <div className="relative mx-auto h-[24rem] w-full max-w-[400px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
        <Image
          src={thumbImageUrl}
          alt={title}
          layout="fill"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/DefaultImage.png';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
          {magazineId}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-[1.5rem] text-white">
          <span className="mb-2 inline-block rounded-md bg-[#F93A7B] px-[0.56rem] py-[0.25rem] text-[0.75rem]  text-white">
            BeatBuddy Pick!
          </span>

          <h2 className="text-[1.5rem] font-semibold leading-tight drop-shadow-md">
            {title}
          </h2>
          <div className="h-[0.03125rem] w-full bg-gray200 my-[0.75rem]" />

          <p className="text-[0.75rem] text-gray200 font-light drop-shadow-md">{content}</p>
        </div>
      </div>
    </Link>
    
  );
}
