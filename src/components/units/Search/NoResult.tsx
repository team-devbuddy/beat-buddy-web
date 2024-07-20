'use client';
import React from 'react';
import Image from 'next/image';

export default function NoResults() {
  return (
    <div className="relative flex w-full flex-col">
      <div className="flex h-full flex-col items-center justify-center py-[10rem]">
        <Image src="/icons/caution.svg" alt="caution image" width={56.679} height={52} />
        <p className="mt-[1.25rem] text-gray300">검색 결과가 없습니다.</p>
      </div>
    </div>
  );
}
