'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EventWriteHeader() {
  const router = useRouter();
  return (
    <div className="py-4 pr-5 pl-[0.62rem] max-w-[600px] mx-auto flex items-center justify-between relative">
      <Image
        src="/icons/line-md_chevron-left.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={() => router.back()}
        className="cursor-pointer"
      />
    </div>
  );
}
