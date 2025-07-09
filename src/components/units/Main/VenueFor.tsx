'use client';

import Link from 'next/link';
import Image from 'next/image';

interface VenueForProps {
  userName: string | null;
}

export default function VenueFor({ userName }: VenueForProps) {
  return (
    <Link href="/bbp-list" passHref>
      <div className="mx-4 my-[1.5rem] flex cursor-pointer items-center justify-between rounded-[0.5rem] bg-main p-4 hover:brightness-75">
        <div className="flex flex-col justify-center gap-y-[0.13rem]">
          <span className="text-[1.25rem] text-white">{userName ? `Venue for ${userName}버디` : 'BeatBuddy Pick'}</span>
          <span className="text-[0.875rem] text-white">나에게 딱 맞는 베뉴들의 정보를 확인하세요!</span>
        </div>
        <Image src="/icons/rightArrowWhite.svg" alt="Arrow head right icon" width={24} height={24} />
      </div>
    </Link>
  );
}
