'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EventWriteHeader() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-[600px] mx-auto flex items-center justify-between relative">
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
