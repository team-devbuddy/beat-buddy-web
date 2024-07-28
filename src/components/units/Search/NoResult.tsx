'use client';
import Image from 'next/image';

export default function NoResults() {
  return (
    <div className="relative  flex w-full bg-BG-black flex-col">
      <div className="flex h-full flex-col items-center justify-center py-[8.75rem]">
        <Image src="/icons/blackLogo.svg" alt="caution image" width={120} height={120} />
        <p className="mt-[1rem] text-body2-15-medium text-gray300">조건에 맞는 검색 결과가 없습니다.</p>
      </div>
    </div>
  );
}
